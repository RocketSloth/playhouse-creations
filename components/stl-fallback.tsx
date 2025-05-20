import { FileText, AlertCircle } from "lucide-react"

interface STLFallbackProps {
  fileName: string
  fileSize: number
  error?: string
}

export function STLFallback({ fileName, fileSize, error }: STLFallbackProps) {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 flex flex-col items-center justify-center p-4">
      <FileText className="h-12 w-12 text-gray-400 mb-2" />
      <h3 className="text-lg font-medium">{fileName}</h3>
      <p className="text-sm text-gray-500">File size: {(fileSize / 1024 / 1024).toFixed(2)} MB</p>

      {error && (
        <div className="mt-4 flex items-center text-red-500">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <p className="mt-4 text-sm text-gray-500 text-center">
        3D preview is not available. Your file has been uploaded successfully and will be processed.
      </p>
    </div>
  )
}
