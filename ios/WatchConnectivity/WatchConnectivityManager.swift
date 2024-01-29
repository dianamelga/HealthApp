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


//@available(iOS 13.0, *)
@objcMembers
final class WatchConnectivityManager: NSObject, ObservableObject {
  @Published var notificationMessage: NotificationMessage? = nil
  static let shared = WatchConnectivityManager()
  
  // Add a method to notify when the notificationMessage changes
  private func notifyNotificationMessageChanged() {
      NotificationCenter.default.post(name: Notification.Name("NotificationMessageChanged"), object: self)
  }
  
  private override init() {
    super.init()
    
    // this will establish a connection between iOS and watchOS app
    if WCSession.isSupported() {
      WCSession.default.delegate = self
      WCSession.default.activate()
    }
  }
  
  private let kMessageKey = "message"
  
  func send(_ message: String) {
    guard WCSession.default.activationState == .activated else {
      print("activationState != .activated")
      return
    }
    #if os(iOS)
    guard WCSession.default.isWatchAppInstalled else {
      print("watch app is not installed")
      return
    }
    #else
    guard WCSession.default.isCompanionAppInstalled else {
      print("Companion app is not installed")
      return
    }
    #endif
    
    //          WCSession.default.transferUserInfo([kMessageKey : message])
    
    print("attempt to send message:\(message)")
    WCSession.default.sendMessage([kMessageKey : message], replyHandler: nil) { error in
      print("Cannot send message: \(String(describing: error))")
    }
  }
}

//@available(iOS 13.0, *)
extension WatchConnectivityManager: WCSessionDelegate {
  func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
    if let notificationText = message[kMessageKey] as? String {
      DispatchQueue.main.async { [weak self] in
        print("notification received: \(notificationText)")
        self?.notificationMessage = NotificationMessage(text: notificationText)
        
        #if os(iOS)
        self?.notifyNotificationMessageChanged()
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
  
  #if os(iOS)
  func sessionDidBecomeInactive(_ session: WCSession) {}
  func sessionDidDeactivate(_ session: WCSession) {
    session.activate()
  }
  #endif
}
