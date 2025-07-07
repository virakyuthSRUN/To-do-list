"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DynamicSectionLayout } from "@/components/dynamic-section-layout"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"

interface Activity {
  type: string
  duration: number
  intensity: number
}

interface ActivityRecommendation {
  type: string
  description: string
  benefits: string[]
  duration: string
  intensity: string
  imagePath: string
  additionalInfo?: {
    diet: string
    sleepHours: string
    healthGoals: string
  }
}

export function ActivityMonitor() {
  const { t, language } = useLanguage()
  const [currentActivity, setCurrentActivity] = useState<Activity>({
    type: "",
    duration: 30,
    intensity: 5,
  })
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [fitnessLevel, setFitnessLevel] = useState("")
  const [recommendation, setRecommendation] = useState<ActivityRecommendation | null>(null)
  const [activityData, setActivityData] = useState<any[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const analyzeActivity = async () => {
    setIsLoading(true)
    setError("")

    const additionalInfo = {
      diet: (document.getElementById("diet") as HTMLTextAreaElement).value,
      sleepHours: (document.getElementById("sleepHours") as HTMLInputElement).value,
      healthGoals: (document.getElementById("healthGoals") as HTMLInputElement).value,
    }

    try {
      const response = await fetch("/api/analyze-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activity: currentActivity,
          age,
          gender,
          fitnessLevel,
          additionalInfo,
          language, // Add language parameter
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze activity")
      }

      const result = await response.json()
      setRecommendation({ ...result, additionalInfo })
      setActivityData(result.activityData || [])
      setIsSubmitted(true)
    } catch (err) {
      setError(t("activity.error"))
    } finally {
      setIsLoading(false)
    }
  }

  const InputContainer = (
    <Card className="w-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
      <CardHeader>
        <CardTitle>{t("activity.title")}</CardTitle>
        <CardDescription>{t("activity.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="age">{t("activity.age")}</Label>
            <Input id="age" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="gender">{t("activity.gender")}</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder={t("activity.gender.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t("activity.gender.male")}</SelectItem>
                <SelectItem value="female">{t("activity.gender.female")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="fitnessLevel">{t("activity.fitnessLevel")}</Label>
            <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
              <SelectTrigger>
                <SelectValue placeholder={t("activity.fitnessLevel.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">{t("activity.fitnessLevel.beginner")}</SelectItem>
                <SelectItem value="intermediate">{t("activity.fitnessLevel.intermediate")}</SelectItem>
                <SelectItem value="advanced">{t("activity.fitnessLevel.advanced")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("activity.type")}</Label>
            <Input
              placeholder={t("activity.type.placeholder")}
              value={currentActivity.type}
              onChange={(e) => setCurrentActivity((prev) => ({ ...prev, type: e.target.value }))}
            />
          </div>
          <div>
            <Label>{t("activity.duration")}</Label>
            <Slider
              value={[currentActivity.duration]}
              onValueChange={(value) => setCurrentActivity((prev) => ({ ...prev, duration: value[0] }))}
              max={120}
              step={5}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              {currentActivity.duration} {t("activity.minutes")}
            </p>
          </div>
          <div>
            <Label>{t("activity.intensity")}</Label>
            <Slider
              value={[currentActivity.intensity]}
              onValueChange={(value) => setCurrentActivity((prev) => ({ ...prev, intensity: value[0] }))}
              max={10}
              step={1}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              {t("activity.level")} {currentActivity.intensity}
            </p>
          </div>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="diet">{t("activity.diet")}</Label>
              <Textarea id="diet" placeholder={t("activity.diet.placeholder")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="sleepHours">{t("activity.sleepHours")}</Label>
              <Input
                id="sleepHours"
                type="number"
                placeholder={t("activity.sleepHours.placeholder")}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="healthGoals">{t("activity.healthGoals")}</Label>
              <Input id="healthGoals" placeholder={t("activity.healthGoals.placeholder")} className="mt-1" />
            </div>
          </div>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button onClick={analyzeActivity} disabled={!currentActivity.type || isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("activity.analyzing")}
            </>
          ) : (
            t("activity.analyze")
          )}
        </Button>
      </CardContent>
    </Card>
  )

  const OutputContainer = recommendation && (
    <Card className="w-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
      <CardHeader>
        <CardTitle>{t("activity.recommendations")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{t("activity.recommendations")}</h3>
          <p className="text-gray-600 mb-4">{recommendation.description}</p>
          <div className="relative w-full h-[300px] mb-4">
            <Image
              src={recommendation.imagePath || "/placeholder.svg"}
              alt={recommendation.type}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">{t("activity.benefits")}</h4>
          <ul className="list-none pl-5 space-y-1">
            {recommendation.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-600">
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4">{t("activity.weeklyTracking")}</h4>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: t("activity.minutes"), angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="minutes" fill="#4CAF50" name={t("activity.duration")} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Icons.user className="h-5 w-5 mr-2 text-primary" />
            {t("activity.additionalInfo")}
          </h4>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Lifestyle Information */}
            <div className="space-y-4">
              <div className="bg-cyan-50 p-4 rounded-lg border-l-4 border-cyan-400">
                <h5 className="font-semibold text-cyan-800 mb-2 flex items-center">
                  <Icons.activity className="h-4 w-4 mr-2" />
                  {t("activity.diet")}
                </h5>
                <p className="text-cyan-700 text-sm">
                  {recommendation?.additionalInfo?.diet || t("common.noInformation")}
                </p>
                {recommendation?.additionalInfo?.diet && (
                  <div className="mt-2 p-2 bg-cyan-100 rounded text-xs text-cyan-600">🥗 {t("activity.diet")}</div>
                )}
              </div>

              <div className="bg-violet-50 p-4 rounded-lg border-l-4 border-violet-400">
                <h5 className="font-semibold text-violet-800 mb-2 flex items-center">
                  <Icons.brain className="h-4 w-4 mr-2" />
                  {t("activity.sleepHours")}
                </h5>
                <p className="text-violet-700 text-sm">
                  {recommendation?.additionalInfo?.sleepHours
                    ? `${recommendation.additionalInfo.sleepHours} ${t("activity.sleepHours")}`
                    : t("common.noInformation")}
                </p>
                {recommendation?.additionalInfo?.sleepHours && (
                  <div className="mt-2 p-2 bg-violet-100 rounded text-xs text-violet-600">
                    😴 {t("activity.sleepHours")}
                  </div>
                )}
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                <h5 className="font-semibold text-amber-800 mb-2 flex items-center">
                  <Icons.stethoscope className="h-4 w-4 mr-2" />
                  {t("activity.healthGoals")}
                </h5>
                <p className="text-amber-700 text-sm">
                  {recommendation?.additionalInfo?.healthGoals || t("common.noInformation")}
                </p>
                {recommendation?.additionalInfo?.healthGoals && (
                  <div className="mt-2 p-2 bg-amber-100 rounded text-xs text-amber-600">
                    🎯 {t("activity.healthGoals")}
                  </div>
                )}
              </div>
            </div>

            {/* Activity Performance Dashboard */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Icons.activity className="h-4 w-4 mr-2" />
                  {t("activity.assessment")}
                </h5>

                {/* Activity Level */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t("activity.activityLevel")}</span>
                    <span className="font-semibold">
                      {currentActivity.intensity >= 7
                        ? t("activity.high")
                        : currentActivity.intensity >= 4
                          ? t("activity.medium")
                          : t("activity.low")}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                      style={{ width: `${(currentActivity.intensity / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white p-2 rounded text-center">
                    <div className="text-lg font-bold text-green-600">{currentActivity.duration}</div>
                    <div className="text-xs text-gray-600">{t("activity.minutes")}</div>
                  </div>
                  <div className="bg-white p-2 rounded text-center">
                    <div className="text-lg font-bold text-blue-600">{currentActivity.intensity}</div>
                    <div className="text-xs text-gray-600">{t("activity.level")}</div>
                  </div>
                  <div className="bg-white p-2 rounded text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {Math.round(currentActivity.duration * currentActivity.intensity * 0.8)}
                    </div>
                    <div className="text-xs text-gray-600">{t("activity.calories")}</div>
                  </div>
                </div>
              </div>

              {/* Weekly Goal Progress */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Icons.stethoscope className="h-4 w-4 mr-2" />
                  {t("activity.weeklyGoal")}
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("activity.goal")}</span>
                    <span className="font-semibold">
                      {activityData.reduce((sum, day) => sum + day.minutes, 0)} {t("activity.minutes")}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min((activityData.reduce((sum, day) => sum + day.minutes, 0) / 150) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-blue-600">
                    {activityData.reduce((sum, day) => sum + day.minutes, 0) >= 150
                      ? t("activity.congratulations")
                      : `${t("activity.remaining")} ${150 - activityData.reduce((sum, day) => sum + day.minutes, 0)} ${t("activity.minutes")}`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Improvement Plan */}
          <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
            <h5 className="font-semibold mb-3 flex items-center text-indigo-800">
              <Icons.activity className="h-5 w-5 mr-2" />
              {t("activity.improvementPlan")}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl mb-2">🏃‍♂️</div>
                <div className="font-semibold text-sm text-indigo-800">{t("activity.thisWeek")}</div>
                <div className="text-xs text-gray-600">{t("activity.increase10")}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl mb-2">📈</div>
                <div className="font-semibold text-sm text-indigo-800">{t("activity.2weeks")}</div>
                <div className="text-xs text-gray-600">{t("activity.measureProgress")}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold text-sm text-indigo-800">{t("activity.1month")}</div>
                <div className="text-xs text-gray-600">{t("activity.newGoals")}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl mb-2">🏆</div>
                <div className="font-semibold text-sm text-indigo-800">{t("activity.3months")}</div>
                <div className="text-xs text-gray-600">{t("activity.overallResults")}</div>
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
