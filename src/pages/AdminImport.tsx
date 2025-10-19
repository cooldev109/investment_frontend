import { useState, useRef } from "react";
import { Upload, Download, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import api from "../lib/api";

interface ImportError {
  row: number;
  error: string;
  data?: any;
}

interface ImportResult {
  totalRows: number;
  imported: number;
  failed: number;
  errors: ImportError[];
  projects: any[];
}

export default function AdminImport() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      // Validate file type
      if (
        droppedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        droppedFile.type === "application/vnd.ms-excel" ||
        droppedFile.name.endsWith(".xlsx") ||
        droppedFile.name.endsWith(".xls")
      ) {
        setFile(droppedFile);
        setResult(null);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
      }
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/import/projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data.data);

      toast({
        title: "Import Complete",
        description: `Successfully imported ${response.data.data.imported} of ${response.data.data.totalRows} projects`,
      });
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import projects",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Download template
  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get("/import/template", {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "project-import-template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        title: "Template Downloaded",
        description: "Excel template has been downloaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download template",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Import Projects</h1>
        <p className="text-muted-foreground mt-2">
          Upload an Excel file to bulk import projects into the platform
        </p>
      </div>

      {/* Instructions Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Download the Excel template using the button below</li>
            <li>Fill in the project details following the template format</li>
            <li>Upload the completed Excel file</li>
            <li>Review the import results and fix any errors if needed</li>
          </ol>
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            className="mt-4"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </CardContent>
      </Card>

      {/* Upload Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Excel File</CardTitle>
          <CardDescription>
            Supported formats: .xlsx, .xls (Max size: 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Drag & Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />

            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />

            {file ? (
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium mb-2">
                  Drag and drop your Excel file here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse
                </p>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex gap-4 mt-4">
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload and Import
                </>
              )}
            </Button>

            {file && (
              <Button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                variant="outline"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.failed === 0 ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">{result.totalRows}</p>
                <p className="text-sm text-muted-foreground">Total Rows</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {result.imported}
                </p>
                <p className="text-sm text-muted-foreground">Imported</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {result.failed}
                </p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>

            {/* Error List */}
            {result.errors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Errors ({result.errors.length})
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">
                          Row
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium">
                          Error
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {result.errors.map((error, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">{error.row}</td>
                          <td className="px-4 py-2 text-sm text-red-600">
                            {error.error}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Success Message */}
            {result.failed === 0 && (
              <div className="text-center py-4">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                <p className="font-medium text-green-600">
                  All projects imported successfully!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
