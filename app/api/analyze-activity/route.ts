import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { activity, age, gender, fitnessLevel, additionalInfo, language = "km" } = await request.json()

    const isEnglish = language === "en"
    const targetLanguage = isEnglish ? "English" : "Khmer"

    const prompt = `
    You are a fitness and health AI assistant that provides activity recommendations in ${targetLanguage} language.
    
    User Information:
    - Age: ${age}
    - Gender: ${gender}
    - Fitness Level: ${fitnessLevel}
    - Current Activity: ${activity.type}
    - Duration: ${activity.duration} minutes
    - Intensity: ${activity.intensity}/10
    - Diet: ${additionalInfo.diet || "Not provided"}
    - Sleep Hours: ${additionalInfo.sleepHours || "Not provided"}
    - Health Goals: ${additionalInfo.healthGoals || "Not provided"}
    
    Please provide personalized fitness recommendations in ${targetLanguage} language:
    1. Activity type recommendation
    2. Benefits of the recommended activity
    3. Optimal duration and intensity
    4. Health improvements expected
    
    Format your response as a JSON object:
    {
      "type": "Activity type in ${targetLanguage}",
      "description": "Description in ${targetLanguage}",
      "benefits": ["benefit1 in ${targetLanguage}", "benefit2 in ${targetLanguage}", ...],
      "duration": "Recommended duration in ${targetLanguage}",
      "intensity": "Recommended intensity in ${targetLanguage}",
      "healthImprovements": "Expected improvements in ${targetLanguage}"
    }
    
    Make recommendations realistic and safe based on the user's profile.
    `

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: prompt,
      maxTokens: 1500,
    })

    let aiResponse
    try {
      aiResponse = JSON.parse(text)
    } catch {
      // Fallback response
      if (isEnglish) {
        aiResponse = {
          type: "Walking",
          description:
            "Walking is an excellent exercise for heart health and calorie burning. It's suitable for people of all ages and fitness levels.",
          benefits: ["Strengthens heart health", "Reduces blood cholesterol", "Increases energy", "Reduces stress"],
          duration: "30-60 minutes per day",
          intensity: "Moderate",
          healthImprovements:
            "Regular walking can help improve heart health, reduce risk of diabetes, and enhance mood.",
        }
      } else {
        aiResponse = {
          type: "ការដើរ",
          description: "ការដើរជាលំហាត់ប្រាណដ៏ល្អសម្រាប់សុខភាពបេះដូង និងការដុតកាឡូរី។ វាសមស្របសម្រាប់មនុស្សគ្រប់វ័យ និងកម្រិតសមត្ថភាព។",
          benefits: ["ពង្រឹងសុខភាពបេះដូង", "កាត់បន្ថយជាតិខ្លាញ់ក្នុងឈាម", "បង្កើនថាមពល", "កាត់បន្ថយភាពតានតឹង"],
          duration: "30-60 នាទីក្នុងមួយថ្ងៃ",
          intensity: "មធ្យម",
          healthImprovements: "ការដើរជាទៀងទាត់អាចជួយកែលម្អសុខភាពបេះដូង កាត់បន្ថយហានិភ័យនៃជំងឺទឹកនោមផ្អែម និងបង្កើនអារម្មណ៍ល្អ។",
        }
      }
    }

    // Generate realistic activity data with appropriate day names
    const dayNames = isEnglish
      ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      : ["ថ្ងៃច័ន្ទ", "ថ្ងៃអង្គារ", "ថ្ងៃពុធ", "ថ្ងៃព្រហស្បតិ៍", "ថ្ងៃសុក្រ"]

    const activityData = dayNames.map((name, index) => ({
      name,
      minutes: index === 1 || index === 4 ? activity.duration : Math.floor(Math.random() * 40) + 20,
    }))

    return NextResponse.json({
      ...aiResponse,
      imagePath: "/placeholder.svg?text=Activity+Recommendation&width=400&height=300",
      activityData,
      additionalInfo,
    })
  } catch (error) {
    console.error("Error analyzing activity:", error)
    return NextResponse.json({ error: "Failed to analyze activity" }, { status: 500 })
  }
}
