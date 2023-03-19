package config

import (
	"github.com/go-playground/validator/v10"
	"log"
	"os"
)

type Logger struct {
	Error     *log.Logger
	Info      *log.Logger
	Debug     *log.Logger
	Validator *validator.Validate
}

func NewLogger() *Logger {
	return &Logger{
		Error:     log.New(os.Stdout, "[Error]: ", log.LstdFlags|log.Lshortfile),
		Info:      log.New(os.Stdout, "[Info]: ", log.LstdFlags|log.Lshortfile),
		Debug:     log.New(os.Stdout, "[Debug]: ", log.LstdFlags|log.Lshortfile),
		Validator: validator.New(),
	}
}
