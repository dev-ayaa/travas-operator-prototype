package upload

import (
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"

	"path/filepath"
)

var MEMORYMAXSIZE = 1024 * 1024

func SingleFile(form *multipart.Form, key, dataKey string ) (map[string]any, error) {
	imageInfo := make(map[string]any, 0)
	file, ok := form.File[key]
	if !ok { 
		return nil, errors.New("cannot get upload file")
	}	

	if file[0].Filename != "" {
		f, err := file[0].Open()
		if err != nil {
			return nil, err
		}

		defer func(f multipart.File) {
			err := f.Close()
			if err != nil {
				return 
				}
		}(f)

		fileByte, err := ioutil.ReadAll(f)
		if err != nil {
			return nil, err

		}
		if len(fileByte) > MEMORYMAXSIZE {
			return nil, errors.New("file size too large")
		}
		ext := filepath.Ext(file[0].Filename)
		if ext != ".png" && ext != ".jpg" && ext != ".jpeg" {
			return nil, errors.New("invalid image format")
		}

		imageInfo[dataKey] = fileByte
	}
	imageInfo[key] = file[0]
	return imageInfo, nil
}

// MultiFile : Check through the uploaded images. validate the filesize, format and append to a slice of a map
func MultiFile(form *multipart.Form, key, dataKey string) (map[string]interface{}, error) {
	imageArr := make(map[string]interface{}, 0)
  
  log.Println(form)

  file, ok := form.File[key]
  log.Println(file)
	if !ok {
    return nil, errors.New("No available file")
  }
  
	for i, ff := range file {
		if ff.Filename != "" { 	
			f, err := ff.Open()
      if err != nil {
				return nil, err
			}

			defer func(f multipart.File) {
				err := f.Close()
				if err != nil {
					return
				}
			}(f)

      var content []byte
      for {
        buffer := make([]byte, 512)
         n, err := f.Read(buffer)
         if err == io.EOF {
           break
         } else if err != nil {
           return nil, err
         }
         content = append(content, buffer[:n]...)
       }

			if len(content) > MEMORYMAXSIZE {
				return nil, errors.New("file size too large")
			}

			ext := filepath.Ext(ff.Filename)
			if ext != ".png" && ext != ".jpg" && ext != ".jpeg" {
				return nil, errors.New("invalid image format")
			}

			bk := fmt.Sprintf("%s_%d",dataKey ,i)
			img := fmt.Sprintf("%s_%d",key, i)

      imageArr[bk] = append(imageArr[bk].([][]byte), content)
			imageArr[img] = append(imageArr[img].([]*multipart.FileHeader), ff)

		}
	}
	return imageArr, nil
}
