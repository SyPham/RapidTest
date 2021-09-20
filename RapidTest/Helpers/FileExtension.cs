using Microsoft.AspNetCore.Http;
using NetUtility;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace RapidTest.Helpers
{
    public class FileExtension
    {
        public void CreateFolder(string folderPath)
        {
            // Specify the directory you want to manipulate.
            string path = $"{folderPath}";
            Regex pattern = new Regex(@"\\+");
            var res = pattern.Replace(path, "\\");
            try
            {
                // Determine whether the directory exists.
                var check = Directory.Exists(res);
                if (check)
                {
                    return;
                }
                // Try to create the directory.
                DirectoryInfo di = Directory.CreateDirectory(res);
            }
            catch
            {
            }
        }
        private Random random = new Random();
        public string RandomString(int length = 50)
        {
            const string chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public bool Exists(string path)
        {
            return File.Exists(Path.Combine(path));
        }
        /// <summary>
        /// Ghi file
        /// </summary>
        /// <param name="file"></param>
        /// <param name="folderPath">Đường dẫn lưu thư file</param>
        /// <returns></returns>
        public async Task<string> WriteAsync(IFormFile file, string uploadFolder)
        {
            if (file.IsNullOrEmpty())
            {
                return null;
            }
            // Đường dẫn folder để lưu file
            //string uploadFolder = Path.Combine(folderPath);
            CreateFolder(uploadFolder);
            string ext = System.IO.Path.GetExtension(file.FileName).ToSafetyString().ToLower();
            string uniqueFileName = RandomString() + DateTime.Now.ToString("yyyyMMddHHmmssffff") + ext;
            var filePath = Path.Combine(uploadFolder, uniqueFileName);

            if (Exists(filePath) == false)
            {
                using var stream = File.Create(filePath);
                await file.CopyToAsync(stream);
                return uniqueFileName;
            }
            else
            {
                return await WriteAsync(file, filePath);
            }
        }
        /// <summary>
        /// Ghi file
        /// </summary>
        /// <param name="file"></param>
        /// <param name="folderPath">Đường dẫn lưu thư file</param>
        /// <returns></returns>
        public async Task<string> WriteAsync(IFormFile file, string uploadFolder, string fileName)
        {
            if (file.IsNullOrEmpty())
            {
                return null;
            }
            // Đường dẫn folder để lưu file
            //string uploadFolder = Path.Combine(folderPath);
            CreateFolder(uploadFolder);
            string ext = System.IO.Path.GetExtension(file.FileName).ToSafetyString().ToLower();
            string name = System.IO.Path.GetFileName(file.FileName);
            fileName = fileName.Replace(ext, "");
            string uniqueFileName = $"{fileName}-{DateTime.Now.ToString("yyyyMMddHHmmssffff")}{ext}";
            var filePath = Path.Combine(uploadFolder, uniqueFileName);
            var filePathTemp = Path.Combine(uploadFolder, $"{fileName}{ext}");
            if (File.Exists(filePathTemp) == false)
            {
                filePath = filePathTemp;
                uniqueFileName = $"{fileName}{ext}";
            } 

            if (Exists(filePath) == false)
            {
                using var stream = File.Create(filePath);
                await file.CopyToAsync(stream);
                return uniqueFileName;
            }
            else
            {
                return await WriteAsync(file, filePath);
            }
        }
        /// <summary>
        /// Ghi file
        /// </summary>
        /// <param name="file"></param>
        /// <param name="uploadFolder">Đường dẫn lưu thư file</param>
        /// <returns></returns>
        public string Write(IFormFile file, string uploadFolder)
        {
            if (file.IsNullOrEmpty())
            {
                return null;
            }
            // Đường dẫn folder để lưu file
            //string uploadFolder = Path.Combine(uploadFolder);

            string uniqueFileName = Guid.NewGuid().ToString() + '_' + file.FileName;
            CreateFolder(uploadFolder);
            var filePath = Path.Combine(uploadFolder, uniqueFileName);

            if (Exists(uploadFolder) == false)
            {
                using var stream = File.Create(filePath);
                file.CopyToAsync(stream);
                return uniqueFileName;
            }
            else
            {
                return Write(file, filePath);
            }
        }
        /// <summary>
        /// Nếu file có thì xóa.
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public bool Remove(string path)
        {
            if (path.IsNullOrEmpty() == false)
            {
                var check = Exists(path);
                if (check)
                {
                    try
                    {
                        File.Delete(path);
                        return true;
                    }
                    catch (Exception)
                    {
                        return false;
                    }
                }

            }
            return false;
        }
    }
}
