import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { symptoms, age, gender, duration, additionalInfo, language = "km" } = await request.json()

    const isEnglish = language === "en"
    const targetLanguage = isEnglish ? "English" : "Khmer"

    const prompt = `
    You are a medical AI assistant that helps analyze symptoms in ${targetLanguage} language.
    
    Patient Information:
    - Age: ${age}
    - Gender: ${gender}
    - Symptom Duration: ${duration}
    - Symptoms: ${symptoms.join(", ")}
    - Medical History: ${additionalInfo.medicalHistory || "Not provided"}
    - Current Medications: ${additionalInfo.currentMedications || "Not provided"}
    - Allergies: ${additionalInfo.allergies || "Not provided"}
    
    Please provide a medical analysis in ${targetLanguage} language that includes:
    1. Most likely condition based on symptoms
    2. Risk level assessment (low, medium, high)
    3. Detailed recommendations
    4. When to seek medical attention
    
    Format your response as a JSON object:
    {
      "name": "Condition name in ${targetLanguage}",
      "description": "Detailed description in ${targetLanguage}",
      "riskLevel": "low|medium|high",
      "recommendations": ["recommendation1 in ${targetLanguage}", "recommendation2 in ${targetLanguage}", ...],
      "symptoms": ["matching symptoms in ${targetLanguage}"],
      "whenToSeekHelp": "When to see a doctor in ${targetLanguage}"
    }
    
    Always include medical disclaimers and emphasize consulting healthcare professionals.
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
          name: "Common Cold",
          description:
            "A common cold is caused by viral infection. It can heal naturally within 7-10 days. Please note: This analysis is for informational purposes only.",
          riskLevel: "low",
          recommendations: [
            "Get adequate rest",
            "Drink plenty of fluids",
            "Use pain relievers if necessary",
            "Keep body warm",
          ],
          symptoms: symptoms,
          whenToSeekHelp: "Consult with a doctor if symptoms worsen or don't improve within 7-10 days",
        }
      } else {
        aiResponse = {
          name: "ផ្តាសាយធម្មតា",
          description:
            "ជំងឺផ្តាសាយធម្មតាបណ្តាលមកពីមេរោគវីរុស។ វាអាចជាសះស្បើយដោយខ្លួនឯងក្នុងរយៈពេល 7-10 ថ្ងៃ។ សូមចាំថា៖ ការវិភាគនេះគ្រាន់តែជាការណែនាំប៉ុណ្ណោះ។",
          riskLevel: "low",
          recommendations: ["សម្រាកឱ្យបានគ្រប់គ្រាន់", "ផឹកទឹកច្រើន", "ប្រើថ្នាំបំបាត់ការឈឺចាប់បើចាំបាច់", "រក្សាកម្តៅរាងកាយឱ្យនៅក្តៅល្មម"],
          symptoms: symptoms,
          whenToSeekHelp: "ពិគ្រោះជាមួយវេជ្ជបណ្ឌិតប្រសិនបើសញ្ញាអាការៈធ្ងន់ធ្ងរឡើង ឬមិនប្រសើរឡើងក្នុងរយៈពេល 7-10 ថ្ងៃ",
        }
      }
    }

    return NextResponse.json({
      ...aiResponse,
      imagePath: "/placeholder.svg?text=Medical+Condition&width=400&height=300",
      additionalInfo,
    })
  } catch (error) {
    console.error("Error analyzing symptoms:", error)
    return NextResponse.json({ error: "Failed to analyze symptoms" }, { status: 500 })
  }
}
