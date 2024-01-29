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

- (void)sendMessageToWatch:(NSString *)message {
  RCTLogInfo(@"WatchConnectivityModule:sendMessage: %@", message);
  WatchConnectivityManager *watchManager = [WatchConnectivityManager shared];
  [watchManager send:message];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onNotificationMessageChanged"]; // Add other event names if needed
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}


// Will be called when this module's first listener is added.
-(void)startObserving {
  hasListeners = YES;
  // Set up any upstream listeners or background tasks as necessary
  
  // Add an observer for the notification
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(notificationMessageChanged:)
                                               name:@"NotificationMessageChanged"
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

// Method to send message from iPhone to Apple Watch
RCT_EXPORT_METHOD(sendMessage:(NSString *)message)
{
  [self sendMessageToWatch:(NSString *)message];
}

@end
