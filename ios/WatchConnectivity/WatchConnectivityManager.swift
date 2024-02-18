//
//  WatchConnectivityManager.swift
//  HealthApp
//
//  Created by Diana Melgarejo on 2024-01-28.
//
// Singleton Class to manage WatchConnectivity,
// this class is shared between Watch & Companion app.

import Foundation
import WatchConnectivity

@objcMembers
class NotificationMessage: NSObject, Identifiable {
    let id = UUID()
    let text: String

    init(text: String) {
        self.text = text
    }
}

enum WorkoutState: String {
    case notStarted = "not_started"
    case inProgress = "in_progress"
    case completed = "completed"
    case paused = "paused"
    case canceled = "canceled"
}


@objcMembers
final class WatchConnectivityManager: NSObject, ObservableObject {
  @Published var notificationMessage: NotificationMessage? = nil
  
  @Published var workoutState: String? = nil
  @Published var kcalBurned: NSNumber? = nil
  @Published var kcalActiveBurned: NSNumber? = nil
  @Published var elapsedTime: NSNumber? = nil
  @Published var bpm: NSNumber? = nil
  
  static let shared = WatchConnectivityManager()
  
  // MARK: message Keys
  static let kBpm = "bpm"
  static let kKcal = "kcal"
  static let kElapsedTime = "elapsedTime"
  static let kWorkoutState = "workoutState"
  static let kMessage = "message"
  
  private func validateSessionAndAppInstallation() -> Bool {
          guard WCSession.default.activationState == .activated else {
              print("activationState != .activated")
              return false
          }

          #if os(iOS)
          guard WCSession.default.isWatchAppInstalled else {
              print("watch app is not installed")
              return false
          }
          #else
          guard WCSession.default.isCompanionAppInstalled else {
              print("Companion app is not installed")
              return false
          }
          #endif

          return true
      }
  
  
  #if os(iOS)
  var isWatchAvailable: Bool {
      return WCSession.default.isWatchAppInstalled
          && WCSession.isSupported()
          && WCSession.default.isPaired
          && WCSession.default.isReachable
          && WCSession.default.activationState == .activated
  }
  
  var isWatchAppInstalledConnected: Bool {
      return WCSession.default.isWatchAppInstalled
          && WCSession.isSupported()
          && WCSession.default.isPaired
          && WCSession.default.activationState == .activated
  }
  #else
  @Published var isCompanionAppInstalledConnected: Bool = false
  
  private func updateIsCompanionAppInstalledConnected() {
          isCompanionAppInstalledConnected = WCSession.default.isCompanionAppInstalled &&
                                            WCSession.default.activationState == .activated
  }
  #endif
  
  // Add a method to notify when the notificationMessage changes
  private func notifyNotificationMessageChanged() {
      NotificationCenter.default.post(name: Notification.Name("NotificationMessageChanged"), object: self)
  }
  
  #if os(iOS)
  private func notifyWorkoutStateChanged() {
      NotificationCenter.default.post(name: Notification.Name("workoutState"), object: self)
  }
  
  private func notifyBpm() {
      NotificationCenter.default.post(name: Notification.Name("bpm"), object: self)
  }
  
  private func notifyKcal() {
      NotificationCenter.default.post(name: Notification.Name("Kcal"), object: self)
  }
  
  private func notifyElapsedTime() {
      NotificationCenter.default.post(name: Notification.Name("elapsedTime"), object: self)
  }
  #endif
  
  private override init() {
    super.init()
    
    // this will establish a connection between iOS and watchOS app
    if WCSession.isSupported() {
      WCSession.default.delegate = self
      WCSession.default.activate()
    }
    
    #if os(watchOS)
    updateIsCompanionAppInstalledConnected()
    #endif
  }
  
  
  func send(_ messageDictionary: [String: Any]) {
    guard validateSessionAndAppInstallation() else {
                return
            }

    
    print("attempt to send message:\(messageDictionary)")
    WCSession.default.sendMessage(messageDictionary, replyHandler: nil) { error in
      print("Cannot send message: \(String(describing: error))")
    }
  }
  
  func updateWorkoutStateToCompanionApp(_ state: WorkoutState) {
    self.send([WatchConnectivityManager.kWorkoutState: state.rawValue])
  }
  
  func updateWorkoutElapsedTimeToCompanionApp(_ elapsedTimeSeconds: NSNumber) {
    self.send([WatchConnectivityManager.kElapsedTime: elapsedTimeSeconds])
  }
  
}



extension WatchConnectivityManager: WCSessionDelegate {
  func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
    if let notificationText = message[WatchConnectivityManager.kMessage] as? String {
      DispatchQueue.main.async { [weak self] in
        print("notification received: \(notificationText)")
        self?.notificationMessage = NotificationMessage(text: notificationText)
        
        #if os(iOS)
        self?.notifyNotificationMessageChanged()
        #endif
      }
    }
    
    if let workoutState = message[WatchConnectivityManager.kWorkoutState] as? String {
      DispatchQueue.main.async { [weak self] in
        print("workoutState received: \(workoutState)")
        self?.workoutState = workoutState
        
        #if os(iOS)
        self?.notifyWorkoutStateChanged()
        #endif
      }
    }
    
    if let bpm = message[WatchConnectivityManager.kBpm] as? NSNumber {
      DispatchQueue.main.async { [weak self] in
        print("bpm received: \(bpm)")
        self?.bpm = bpm
        
        #if os(iOS)
        self?.notifyBpm()
        #endif
      }
    }
    
    if let kcalsBurned = message[WatchConnectivityManager.kKcal] as? [String: NSNumber],
        let kcal = kcalsBurned["kcalBurned"],
        let kcalActive = kcalsBurned["kcalActiveBurned"] {
      DispatchQueue.main.async { [weak self] in
        print("Kcals received: \(kcalsBurned)")
        self?.kcalBurned = kcal
        self?.kcalActiveBurned = kcalActive
        
        #if os(iOS)
        self?.notifyKcal()
        #endif
      }
    }
    
    if let elapsedTimeSeconds = message[WatchConnectivityManager.kElapsedTime] as? NSNumber {
      DispatchQueue.main.async { [weak self] in
        print("elapsedTime received: \(elapsedTimeSeconds)")
        self?.elapsedTime = elapsedTimeSeconds
        
        #if os(iOS)
        self?.notifyElapsedTime()
        #endif
      }
    }
    
  }
  
  func session(_ session: WCSession,
               activationDidCompleteWith activationState: WCSessionActivationState,
               error: Error?) {
    if let error = error {
      print(
        "Connection: error \(error.localizedDescription)"
      )
    } else {
      // These print calls are just for debugging.
      // activationState values re
      // notActivated = 0, inactive = 1, activated = 2
      print(
        "Connection: activationState = \(activationState.rawValue)"
      )
      print(
        "Connection: reachable? \(session.isReachable)"
      )
    }
  }
  
  internal func sessionReachabilityDidChange(_ session: WCSession) {
        print("sessionReachabilityDidChange: session: \(session)")
        switch session.activationState {
        case .activated:
            print("sessionReachabilityDidChange to activated")
        case .inactive:
            print("sessionReachabilityDidChange to inactive")
        case .notActivated:
            print("sessionReachabilityDidChange to notActivated")
        @unknown default:
            break
        }
    #if os(watchOS)
    updateIsCompanionAppInstalledConnected()
    #endif
  }
  
  
  #if os(iOS)
  internal func sessionWatchStateDidChange(_ session: WCSession) {
      print("sessionWatchStateDidChange: session: \(session)")
  }
  
  func sessionDidBecomeInactive(_ session: WCSession) {
    print("sessionDidBecomeInactive: session: \(session)")
  }
  
  func sessionDidDeactivate(_ session: WCSession) {
    print("sessionDidDeactivate: session: \(session)")
    session.activate()
  }
  #endif
}
