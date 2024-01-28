//
//  HealthAppWatchApp.swift
//  HealthAppWatch Watch App
//
//  Created by Diana Melgarejo on 2024-01-27.
//

import SwiftUI

@main
struct HealthAppWatch_Watch_AppApp: App {
  @StateObject private var workoutManager = WorkoutManager()

  @SceneBuilder var body: some Scene {
      WindowGroup {
          NavigationView {
              StartView()
          }
          .sheet(isPresented: $workoutManager.showingSummaryView) {
              SummaryView()
          }
          .environmentObject(workoutManager)
      }
  }
}
