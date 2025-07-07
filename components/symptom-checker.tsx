"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DynamicSectionLayout } from "@/components/dynamic-section-layout"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"

interface Symptom {
  id: string
  label: string
}

interface Disease {
  name: string
  description: string
  symptoms: string[]
  recommendations: string[]
  riskLevel: "low" | "medium" | "high"
  imagePath: string
  additionalInfo?: {
    medicalHistory: string
    currentMedications: string
    allergies: string
  }
}

export function SymptomChecker() {
  const { t, language } = useLanguage()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [duration, setDuration] = useState("")
  const [result, setResult] = useState<Disease | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [medicalHistory, setMedicalHistory] = useState("")
  const [currentMedications, setCurrentMedications] = useState("")
  const [allergies, setAllergies] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const commonSymptoms: Symptom[] = [
    { id: "fever", label: t("symptoms.fever") },
    { id: "cough", label: t("symptoms.cough") },
    { id: "headache", label: t("symptoms.headache") },
    { id: "sore-throat", label: t("symptoms.soreThroat") },
    { id: "fatigue", label: t("symptoms.fatigue") },
    { id: "body-ache", label: t("symptoms.bodyAche") },
    { id: "runny-nose", label: t("symptoms.runnyNose") },
    { id: "difficulty-breathing", label: t("symptoms.breathingDifficulty") },
  ]

  const handleCheck = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId],
    )
  }

  const analyzeSymptoms = async () => {
    setIsLoading(true)
    setError("")

    const additionalInfo = {
      medicalHistory: (document.getElementById("medicalHistory") as HTMLTextAreaElement).value,
      currentMedications: (document.getElementById("currentMedications") as HTMLInputElement).value,
      allergies: (document.getElementById("allergies") as HTMLInputElement).value,
    }

    try {
      const response = await fetch("/api/analyze-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          age,
          gender,
          duration,
          additionalInfo,
          language, // Add language parameter
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze symptoms")
      }

      const result = await response.json()
      setResult({ ...result, additionalInfo })
      setIsSubmitted(true)
    } catch (err) {
      setError(t("symptoms.error"))
    } finally {
      setIsLoading(false)
    }
  }

  const symptomsData = commonSymptoms.map((symptom) => ({
    name: symptom.label,
    value: selectedSymptoms.includes(symptom.id) ? 1 : 0,
  }))

  const InputContainer = (
    <Card className="w-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
      <CardHeader>
        <CardTitle>{t("symptoms.title")}</CardTitle>
        <CardDescription>{t("symptoms.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="age">{t("symptoms.age")}</Label>
            <Input id="age" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div>
            <Label>{t("symptoms.gender")}</Label>
            <RadioGroup value={gender} onValueChange={setGender}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">{t("symptoms.male")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">{t("symptoms.female")}</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="duration">{t("symptoms.duration")}</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder={t("symptoms.duration.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">{t("symptoms.duration.1-3")}</SelectItem>
                <SelectItem value="4-7">{t("symptoms.duration.4-7")}</SelectItem>
                <SelectItem value="8-14">{t("symptoms.duration.8-14")}</SelectItem>
                <SelectItem value="15+">{t("symptoms.duration.15+")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>{t("symptoms.list")}</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {commonSymptoms.map((symptom) => (
              <div key={symptom.id} className="flex items-center space-x-2">
                <Checkbox
                  id={symptom.id}
                  checked={selectedSymptoms.includes(symptom.id)}
                  onCheckedChange={() => handleCheck(symptom.id)}
                />
                <Label htmlFor={symptom.id}>{symptom.label}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="medicalHistory">{t("medical.medicalHistory")}</Label>
            <Textarea
              id="medicalHistory"
              placeholder={t("medical.medicalHistory.placeholder")}
              className="mt-1"
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="currentMedications">{t("medical.currentMedications")}</Label>
            <Input
              id="currentMedications"
              placeholder={t("medical.currentMedications.placeholder")}
              className="mt-1"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="allergies">{t("medical.allergies")}</Label>
            <Input
              id="allergies"
              placeholder={t("medical.allergies.placeholder")}
              className="mt-1"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button onClick={analyzeSymptoms} disabled={selectedSymptoms.length === 0 || isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("symptoms.analyzing")}
            </>
          ) : (
            t("symptoms.analyze")
          )}
        </Button>
      </CardContent>
    </Card>
  )

  const OutputContainer = result && (
    <Card className="w-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
      <CardHeader>
        <CardTitle>{t("symptoms.results")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4 border-t">
        <div>
          <h3 className="text-lg font-semibold mb-2">{t("symptoms.results")}</h3>
          <p className="text-gray-600 mb-4">{result.description}</p>
          <div className="relative w-full h-[300px] mb-4">
            <Image
              src={result.imagePath || "/placeholder.svg"}
              alt={result.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">{t("symptoms.riskLevel")}</h4>
          <div
            className={`px-4 py-2 rounded-full inline-block ${
              result.riskLevel === "low"
                ? "bg-green-100 text-green-800"
                : result.riskLevel === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {t(`symptoms.risk.${result.riskLevel}`)}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">{t("symptoms.recommendations")}</h4>
          <ul className="list-none pl-5 space-y-1">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="text-gray-600">
                {rec}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-4">{t("symptoms.analysis")}</h4>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4CAF50" name={t("symptoms.list")} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Icons.user className="h-5 w-5 mr-2 text-primary" />
            {t("symptoms.additionalInfo")}
          </h4>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
                <h5 className="font-semibold text-indigo-800 mb-2 flex items-center">
                  <Icons.fileText className="h-4 w-4 mr-2" />
                  {t("medical.medicalHistory")}
                </h5>
                <p className="text-indigo-700 text-sm">
                  {result.additionalInfo?.medicalHistory || t("common.noInformation")}
                </p>
                {result.additionalInfo?.medicalHistory && (
                  <div className="mt-2 p-2 bg-indigo-100 rounded text-xs text-indigo-600">
                    📋 {t("medical.medicalHistory")}
                  </div>
                )}
              </div>

              <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
                <h5 className="font-semibold text-teal-800 mb-2 flex items-center">
                  <Icons.activity className="h-4 w-4 mr-2" />
                  {t("medical.currentMedications")}
                </h5>
                <p className="text-teal-700 text-sm">
                  {result.additionalInfo?.currentMedications || t("common.noInformation")}
                </p>
                {result.additionalInfo?.currentMedications && (
                  <div className="mt-2 p-2 bg-teal-100 rounded text-xs text-teal-600">
                    💊 {t("medical.currentMedications")}
                  </div>
                )}
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                <h5 className="font-semibold text-orange-800 mb-2 flex items-center">
                  <Icons.brain className="h-4 w-4 mr-2" />
                  {t("medical.allergies")}
                </h5>
                <p className="text-orange-700 text-sm">
                  {result.additionalInfo?.allergies || t("common.noInformation")}
                </p>
                {result.additionalInfo?.allergies && (
                  <div className="mt-2 p-2 bg-orange-100 rounded text-xs text-orange-600">
                    ⚠️ {t("medical.allergies")}
                  </div>
                )}
              </div>
            </div>

            {/* Symptom Analysis Dashboard */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-200">
                <h5 className="font-semibold text-pink-800 mb-3 flex items-center">
                  <Icons.stethoscope className="h-4 w-4 mr-2" />
                  {t("symptoms.analysis")}
                </h5>

                {/* Symptom Severity */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t("symptoms.severity")}</span>
                    <span className="font-semibold capitalize">{t(`symptoms.risk.${result.riskLevel}`)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        result.riskLevel === "low"
                          ? "bg-green-500"
                          : result.riskLevel === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: result.riskLevel === "low" ? "30%" : result.riskLevel === "medium" ? "60%" : "90%",
                      }}
                    ></div>
                  </div>
                </div>

                {/* Symptom Count */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedSymptoms.length}</div>
                    <div className="text-xs text-gray-600">{t("symptoms.list")}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((selectedSymptoms.length / commonSymptoms.length) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600">{t("symptoms.percentage")}</div>
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <h5 className="font-semibold text-emerald-800 mb-2 flex items-center">
                  <Icons.activity className="h-4 w-4 mr-2" />
                  {t("symptoms.actionPlan")}
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-emerald-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    {result.riskLevel === "low"
                      ? t("symptoms.monitorSymptoms")
                      : result.riskLevel === "medium"
                        ? t("symptoms.consultDoctor")
                        : t("symptoms.emergencyRoom")}
                  </div>
                  <div className="flex items-center text-sm text-emerald-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    {t("symptoms.getRest")}
                  </div>
                  <div className="flex items-center text-sm text-emerald-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    {t("symptoms.drinkWater")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Monitoring Schedule */}
          <div className="mt-6 bg-slate-50 p-4 rounded-lg">
            <h5 className="font-semibold mb-3 flex items-center">
              <Icons.activity className="h-5 w-5 mr-2 text-primary" />
              {t("symptoms.healthSchedule")}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl mb-1">🏥</div>
                <div className="font-semibold text-sm">{t("symptoms.today")}</div>
                <div className="text-xs text-gray-600">{t("symptoms.checkSymptoms")}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl mb-1">📊</div>
                <div className="font-semibold text-sm">{t("symptoms.2-3days")}</div>
                <div className="text-xs text-gray-600">{t("symptoms.trackChanges")}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl mb-1">👨‍⚕️</div>
                <div className="font-semibold text-sm">{t("symptoms.1week")}</div>
                <div className="text-xs text-gray-600">{t("symptoms.consultPhysician")}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl mb-1">🔄</div>
                <div className="font-semibold text-sm">{t("symptoms.1month")}</div>
                <div className="text-xs text-gray-600">{t("symptoms.recheck")}</div>
              </div>
            </div>
          </div>
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
