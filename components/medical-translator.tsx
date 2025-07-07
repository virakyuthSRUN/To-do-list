"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { Icons } from "@/components/icons"
import Image from "next/image"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DynamicSectionLayout } from "@/components/dynamic-section-layout"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ChatBot } from "@/components/chat-bot"
import { useLanguage } from "@/contexts/language-context"

const translateMedicalTest = async (image: File, additionalInfo: any = {}, language = "km"): Promise<any> => {
  // Convert image to base64 for API call
  const imageData = await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(image)
  })

  const response = await fetch("/api/analyze-medical", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageData,
      additionalInfo,
      language, // Add language parameter
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to analyze medical data")
  }

  return response.json()
}

export function MedicalTranslator() {
  const { t, language } = useLanguage()
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [translation, setTranslation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTranslate = async () => {
    if (!image) return

    setIsLoading(true)
    setError("")
    setTranslation(null)
    setIsSubmitted(false)

    const additionalInfo = {
      medicalHistory: (document.getElementById("medicalHistory") as HTMLTextAreaElement).value,
      currentMedications: (document.getElementById("currentMedications") as HTMLInputElement).value,
      allergies: (document.getElementById("allergies") as HTMLInputElement).value,
    }

    try {
      const result = await translateMedicalTest(image, additionalInfo, language) // Pass current language
      setTranslation(result)
      setIsSubmitted(true)
    } catch (err) {
      setError(t("medical.error"))
    } finally {
      setIsLoading(false)
    }
  }

  const InputContainer = (
    <Card className="w-full shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
      <CardHeader>
        <CardTitle>{t("medical.title")}</CardTitle>
        <CardDescription>{t("medical.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Icons.upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">{t("medical.upload.title")}</span> {t("medical.upload.description")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("medical.upload.formats")}</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
          </label>
        </div>
        {imagePreview && (
          <div className="relative w-full h-64">
            <Image
              src={imagePreview || "/placeholder.svg"}
              alt={t("medical.title")}
              layout="fill"
              objectFit="contain"
            />
          </div>
        )}
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="medicalHistory">{t("medical.medicalHistory")}</Label>
            <Textarea id="medicalHistory" placeholder={t("medical.medicalHistory.placeholder")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="currentMedications">{t("medical.currentMedications")}</Label>
            <Input id="currentMedications" placeholder={t("medical.currentMedications.placeholder")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="allergies">{t("medical.allergies")}</Label>
            <Input id="allergies" placeholder={t("medical.allergies.placeholder")} className="mt-1" />
          </div>
        </div>
        <Button onClick={handleTranslate} disabled={isLoading || !image} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("medical.translating")}
            </>
          ) : (
            t("medical.translate")
          )}
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )

  const OutputContainer = translation && (
    <Card className="w-full shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
      <CardHeader>
        <CardTitle>{t("medical.summary")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{translation.summary}</p>
        {translation.data && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">{t("medical.detailedResults")}</h4>
            <ul>
              {translation.data.map((item: any, index: number) => (
                <li key={index} className="mb-2">
                  <span className="font-medium">{item.name}:</span> {item.value} ({item.normal})
                </li>
              ))}
            </ul>
          </div>
        )}
        {translation.trends && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">{t("medical.healthTrends")}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={translation.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cholesterol" stroke="#8884d8" name="គូឡេស្តេរ៉ូល" />
                <Line type="monotone" dataKey="bloodSugar" stroke="#82ca9d" name="ជាតិស្ករក្នុងឈាម" />
                <Line type="monotone" dataKey="bloodPressure" stroke="#ffc658" name="សម្ពាធឈាម" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {translation.recommendations && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">{t("medical.recommendations")}</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium">{t("medical.diet")}</h5>
                <ul className="list-none pl-5">
                  {translation.recommendations.diet
                    .split("\n")
                    .filter(Boolean)
                    .map((item: string, index: number) => (
                      <li key={index}>{item.trim()}</li>
                    ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium">{t("medical.lifestyle")}</h5>
                <ul className="list-none pl-5">
                  {translation.recommendations.lifestyle
                    .split("\n")
                    .filter(Boolean)
                    .map((item: string, index: number) => (
                      <li key={index}>{item.trim()}</li>
                    ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium">{t("medical.activities")}</h5>
                <ul className="list-none pl-5">
                  {translation.recommendations.activities
                    .split("\n")
                    .filter(Boolean)
                    .map((item: string, index: number) => (
                      <li key={index}>{item.trim()}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">{t("medical.additionalInfo")}</h4>
          <p>
            <strong>{t("medical.medicalHistory")}:</strong>{" "}
            {translation.additionalInfo?.medicalHistory || t("common.noInformation")}
          </p>
          <p>
            <strong>{t("medical.currentMedications")}:</strong>{" "}
            {translation.additionalInfo?.currentMedications || t("common.noInformation")}
          </p>
          <p>
            <strong>{t("medical.allergies")}:</strong>{" "}
            {translation.additionalInfo?.allergies || t("common.noInformation")}
          </p>
        </div>
        <div className="mt-6 pt-6 border-t flex justify-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground hover:text-primary"
            onClick={() => setIsSubmitted(true)}
          >
            {t("medical.continueWithAI")}
          </Button>
        </div>
        {isSubmitted && <ChatBot />}
      </CardContent>
    </Card>
  )

  return (
    <DynamicSectionLayout
      inputContainer={InputContainer}
      outputContainer={OutputContainer}
      isSubmitted={isSubmitted}
      className="container mx-auto px-4"
    />
  )
}
