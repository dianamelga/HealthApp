//
//  RCTWatchConnectivityModule.m
//  HealthApp
//
//  Created by Diana Melgarejo on 2024-01-29.
//  Native Module exposed to RN code to allow iPhone to send/receive messages from Apple Watch
//

#import <Foundation/Foundation.h>
#import "RCTWatchConnectivityModule.h"
#import "HealthApp-Swift.h"
#import <React/RCTLog.h>

@implementation RCTWatchConnectivityModule
{
  bool hasListeners;
}


// To export a module named RCTWatchConnectivityModule
RCT_EXPORT_MODULE();

- (instancetype)init
{
  self = [super init];
  if (self) {
    hasListeners = NO;
  }
  return self;
}

// Add the method definition for getNotificationMessage
+ (NSDictionary *)getNotificationMessage {
  // Implement the logic to get the notification message here
  WatchConnectivityManager *watchManager = [WatchConnectivityManager shared];
  NotificationMessage *message = watchManager.notificationMessage;
  
  if (message) {
    return @{
      @"text": message.text,
      // Add other properties as needed
    };
  } else {
    return nil;
  }
}

// Add the method definition for getWorkoutState
+ (NSString *)getWorkoutState {
  // Implement the logic to get the notification message here
  WatchConnectivityManager *watchManager = [WatchConnectivityManager shared];
  NSString *workoutState = watchManager.workoutState;
  
  if (workoutState) {
    return workoutState;
  } else {
    return nil;
  }
}

// Add the method definition for getBpm
+ (NSNumber *)getBpm {
  // Implement the logic to get the notification message here
  WatchConnectivityManager *watchManager = [WatchConnectivityManager shared];
  NSNumber *bpm = watchManager.bpm;
  
  if (bpm) {
    return bpm;
  } else {
    return nil;
  }
}

// Add the method definition for getElapsedTime
+ (NSNumber *)getElapsedTime {
  // Implement the logic to get the notification message here
  WatchConnectivityManager *watchManager = [WatchConnectivityManager shared];
  NSNumber *elapsedTime = watchManager.elapsedTime;
  
  if (elapsedTime) {
    return elapsedTime;
  } else {
    return nil;
  }
}

// Add the method definition for getKcal
+ (NSDictionary *)getKcal {
  // Implement the logic to get the notification message here
  WatchConnectivityManager *watchManager = [WatchConnectivityManager shared];
  NSNumber *kcal = watchManager.kcalBurned;
  NSNumber *activeKcal = watchManager.kcalActiveBurned;
  
    return @{
      @"kcal": kcal,
      @"activeKcal": activeKcal
      // Add other properties as needed
    };
}

- (void)sendMessageToWatch:(NSString *)message {
  RCTLogInfo(@"WatchConnectivityModule:sendMessage: %@", message);
  WatchConnectivityManager *watchManager = [WatchConnectivityManager shared];
  [watchManager send:@{WatchConnectivityManager.kMessage: message}];
}

- (void)updateWorkoutStateToWatch:(NSString *)workoutState {
  RCTLogInfo(@"WatchConnectivityModule:updateWorkoutState: %@", workoutState);
  WatchConnectivityManager *watchManager = [WatchConnectivityManager shared];
  [watchManager send:@{WatchConnectivityManager.kWorkoutState: workoutState}];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onNotificationMessageChanged", @"bpm", @"kcal", @"elapsedTime", @"workoutState"];
}


+ (BOOL)requiresMainQueueSetup {
    return YES;
}


// Will be called when this module's first listener is added.
- (void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
    
    // Add an observer for the notification
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(notificationMessageChanged:)
                                                 name:@"NotificationMessageChanged"
                                               object:nil];
    
    // Add observers for other events
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(bpmReceived:)
                                                 name:@"bpm"
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(kcalChanged:)
                                                 name:@"kcal"
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(elapsedTimeChanged:)
                                                 name:@"elapsedTime"
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(workoutStateChanged:)
                                                 name:@"workoutState"
                                               object:nil];
}


// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
  hasListeners = NO;
  // Remove upstream listeners, stop unnecessary background tasks
  
  // Remove the observer when no listeners are present
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)notificationMessageChanged:(NSNotification *)notification {
  if (hasListeners) {
    // Send an event to JavaScript side
    [self sendEventWithName:@"onNotificationMessageChanged" body:[RCTWatchConnectivityModule getNotificationMessage]];
  }
}

- (void)bpmReceived:(NSNotification *)notification {
    if (hasListeners) {
        // Send an event to JavaScript side
        [self sendEventWithName:@"bpm" body:[RCTWatchConnectivityModule getBpm]];
    }
}

- (void)kcalChanged:(NSNotification *)notification {
    if (hasListeners) {
        // Send an event to JavaScript side
        [self sendEventWithName:@"kcal" body:[RCTWatchConnectivityModule getKcal]];
    }
}

- (void)elapsedTimeChanged:(NSNotification *)notification {
    if (hasListeners) {
        // Send an event to JavaScript side
        [self sendEventWithName:@"elapsedTime" body:[RCTWatchConnectivityModule getElapsedTime]];
    }
}

- (void)workoutStateChanged:(NSNotification *)notification {
    if (hasListeners) {
        // Send an event to JavaScript side
        [self sendEventWithName:@"workoutState" body:[RCTWatchConnectivityModule getWorkoutState]];
    }
}


// Method to send message from iPhone to Apple Watch
RCT_EXPORT_METHOD(sendMessage:(NSString *)message)
{
  [self sendMessageToWatch:(NSString *)message];
}

RCT_EXPORT_METHOD(updateWorkoutState:(NSString *)workoutState)
{
  [self updateWorkoutStateToWatch:(NSString *)workoutState];
}

@end
