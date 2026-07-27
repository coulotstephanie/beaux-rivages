import AVFoundation
import Foundation

guard CommandLine.arguments.count == 3 else {
  fputs("Usage: strip-video-audio.swift input output\n", stderr)
  exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let asset = AVURLAsset(url: inputURL)
let composition = AVMutableComposition()
let semaphore = DispatchSemaphore(value: 0)
var exitCode: Int32 = 1

Task {
  do {
    let duration = try await asset.load(.duration)
    let videoTracks = try await asset.loadTracks(withMediaType: .video)

    guard let sourceTrack = videoTracks.first,
          let compositionTrack = composition.addMutableTrack(
            withMediaType: .video,
            preferredTrackID: kCMPersistentTrackID_Invalid
          ) else {
      throw NSError(domain: "BeauxRivagesVideo", code: 1, userInfo: [
        NSLocalizedDescriptionKey: "Aucune piste vidéo trouvée"
      ])
    }

    try compositionTrack.insertTimeRange(
      CMTimeRange(start: .zero, duration: duration),
      of: sourceTrack,
      at: .zero
    )
    compositionTrack.preferredTransform = try await sourceTrack.load(.preferredTransform)

    guard let exporter = AVAssetExportSession(
      asset: composition,
      presetName: AVAssetExportPresetPassthrough
    ) else {
      throw NSError(domain: "BeauxRivagesVideo", code: 2, userInfo: [
        NSLocalizedDescriptionKey: "Impossible de préparer l’export"
      ])
    }

    exporter.outputURL = outputURL
    exporter.outputFileType = .mp4
    exporter.shouldOptimizeForNetworkUse = true
    await exporter.export()

    if exporter.status == .completed {
      exitCode = 0
    } else {
      throw exporter.error ?? NSError(domain: "BeauxRivagesVideo", code: 3)
    }
  } catch {
    fputs("\(error.localizedDescription)\n", stderr)
  }
  semaphore.signal()
}

semaphore.wait()
exit(exitCode)
