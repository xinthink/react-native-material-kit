Pod::Spec.new do |s|
  s.name         = "react-native-material-kit"
  s.version      = "0.3.3"
  s.summary      = "Introducing Material Design to apps built with React Native."
  s.requires_arc = true
  s.author       = { 'xinthink' => 'yingxinwu.g@gmail.com' }
  s.license      = 'MIT'
  s.homepage     = 'https://github.com/xinthink/react-native-material-kit'
  s.source       = { :git => "https://github.com/xinthink/react-native-material-kit.git" }
  s.source_files = 'iOS/RCTMaterialKit/*'
  s.platform     = :ios, "7.0"
  s.dependency 'React'
end
