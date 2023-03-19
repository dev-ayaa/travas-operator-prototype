package internal

import "github.com/gin-gonic/gin"

type MainStore interface {
	// HandlerFuncs for Operator
	Welcome() gin.HandlerFunc

	Register() gin.HandlerFunc
	ProcessRegister() gin.HandlerFunc

	LoginPage() gin.HandlerFunc
	ProcessLogin() gin.HandlerFunc

  // verification of document
	VerifyDocument() gin.HandlerFunc
  CheckStatus() gin.HandlerFunc

	Dashboard() gin.HandlerFunc

	ProcessTourPackage() gin.HandlerFunc
	TestTourPackage() gin.HandlerFunc

	// HandlerFuncs for tour guides

	LoadTourPackage() gin.HandlerFunc
	AddTourGuide() gin.HandlerFunc
	GetTourGuide() gin.HandlerFunc
	DeleteTourGuide() gin.HandlerFunc
	SelectTourGuide() gin.HandlerFunc
}
