package controller

import "github.com/go-playground/validator/v10"

// ValidateImage - Validate the upload image with respect to the value and the set types
func ValidateImage(fl validator.FieldLevel) bool {
	images, ok := fl.Field().Interface().([]map[string]interface{})
	if !ok {
		return false
	}
	return len(images) > 0
}
