//
//  RCTWatchConnectivityModule.h
//  HealthApp
//
//  Created by Diana Melgarejo on 2024-01-29.
//

#ifndef RCTWatchConnectivityModule_h
#define RCTWatchConnectivityModule_h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCTWatchConnectivityModule : RCTEventEmitter <RCTBridgeModule>

- (void)sendMessageToWatch:(NSString *)message;

@end

#endif /* RCTWatchConnectivityModule_h */
