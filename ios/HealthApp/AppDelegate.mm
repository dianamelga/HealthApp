#import "AppDelegate.h"
#import <WatchConnectivity/WatchConnectivity.h>
#import "HealthApp-Swift.h"
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"HealthApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  // Add your custom code here for initialization
    [self setupCustomInitialization];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)setupCustomInitialization {
  // Your custom initialization code goes here
  NSLog(@"App initialized. Performing custom setup.");
  // Add any other initialization code you need.
  // Create an instance of WatchConnectivityManager
  WatchConnectivityManager *watchManager = [WatchConnectivityManager shared];
  [watchManager send: @{WatchConnectivityManager.kMessage: @"Hello"}];

}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
