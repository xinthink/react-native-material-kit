require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-material-kit"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.requires_arc = true
  s.author       = { 'xinthink' => 'yingxinwu.g@gmail.com' }
  s.license      = 'MIT'
  s.homepage     = 'https://github.com/xinthink/react-native-material-kit'
  s.source       = { :git => "https://github.com/xinthink/react-native-material-kit.git" }
  s.source_files = 'iOS/RCTMaterialKit/*'
  s.platform     = :ios, "8.0"
  s.dependency 'React'
end
