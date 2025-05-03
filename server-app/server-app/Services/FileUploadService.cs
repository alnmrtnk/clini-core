using Amazon.S3.Model;
using Amazon.S3;

namespace server_app.Services
{
    public interface IFileUploadService
    {
        Task<string> UploadAsync(IFormFile file);
        string GetPresignedUrl(string key);
    }

    public class FileUploadService : IFileUploadService
    {
        private readonly IAmazonS3 _s3;
        private readonly string _bucket = "medical-records";

        public FileUploadService(IAmazonS3 s3)
        {
            _s3 = s3;
        }

        public async Task<string> UploadAsync(IFormFile file)
        {
            var key = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            using var stream = file.OpenReadStream();
            var request = new PutObjectRequest
            {
                BucketName = _bucket,
                Key = key,
                InputStream = stream
            };

            var response = await _s3.PutObjectAsync(request);

            if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
            {
                throw new Exception($"Failed to upload file to S3. Status: {response.HttpStatusCode}");
            }

            return key;
        }


        public string GetPresignedUrl(string key)
        {
            return $"http://localhost:4566/{_bucket}/{key}";
        }
    }
}
