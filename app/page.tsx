"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MedicalTranslator } from "@/components/medical-translator"
import { SymptomChecker } from "@/components/symptom-checker"
import { ActivityMonitor } from "@/components/activity-monitor"
import { FunctionCard } from "@/components/function-card"
import { ClientNavigation } from "@/components/client-navigation"
import { Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { ChatBot } from "@/components/chat-bot"

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  )
}

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
          <Link className="flex items-center" href="/">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a%20cute%20robot%20with%20a%20doctors%20head%20logo%20with%20a%20white%20background.png-cpvQ0ebZqviz2vUbR997Ar9dubLLDZ.jpeg"
              alt="Doktor AI Logo"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <span className="ml-3 text-2xl font-bold">{t("site.title")}</span>
          </Link>
          <ClientNavigation />
        </div>
      </header>
      <main className="flex-1 pt-20">
        <section className="relative w-full py-8 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
              <p className="text-primary font-medium mb-4">{t("hero.subtitle")}</p>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-4">
                {t("hero.title")}
              </h1>
              <p className="text-xl text-gray-600 mb-8">{t("hero.description")}</p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button asChild size="lg" className="min-w-[200px]">
                  <Link href="#try-now">{t("hero.getStarted")}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="min-w-[200px] bg-transparent">
                  <Link href="#features">{t("hero.learnMore")}</Link>
                </Button>
              </div>
            </div>
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/specialist-working-with-medical-application.jpg-wqNz4IAAN3BkwGA11E21DIjX3J5zcE.jpeg"
                alt="Doctor using advanced medical interface"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">{t("features.title")}</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <FunctionCard
                icon="fileText"
                title={t("features.medical.title")}
                description={t("features.medical.description")}
                imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/featured-medical_interpreter.jpg-j0Dw2k6rLs2VTGfk63Xg6QH9bcScyj.jpeg"
                buttonText={t("features.tryNow")}
                buttonIcon="arrowRight"
                buttonHref="#try-now"
              />
              <FunctionCard
                icon="stethoscope"
                title={t("features.symptom.title")}
                description={t("features.symptom.description")}
                imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iStock-1189302646-1-1080x675-CbOEp1XKyvCYA7PQLK456BykuKjBRD.webp"
                buttonText={t("features.tryNow")}
                buttonIcon="arrowRight"
                buttonHref="#symptom-checker"
              />
              <FunctionCard
                icon="activity"
                title={t("features.activity.title")}
                description={t("features.activity.description")}
                imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1497p16-the-vital-pillars-for-a-healthy-lifestyle.jpg-YaG2TNESQQvTf2781uzs04RxD4qHSf.jpeg"
                buttonText={t("features.tryNow")}
                buttonIcon="arrowRight"
                buttonHref="#activity-monitor"
              />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              {t("howItWorks.title")}
            </h2>
            <div className="grid gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                  ១
                </div>
                <h3 className="text-xl font-bold mb-2">{t("howItWorks.step1.title")}</h3>
                <p className="text-gray-500">{t("howItWorks.step1.description")}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                  ២
                </div>
                <h3 className="text-xl font-bold mb-2">{t("howItWorks.step2.title")}</h3>
                <p className="text-gray-500">{t("howItWorks.step2.description")}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                  ៣
                </div>
                <h3 className="text-xl font-bold mb-2">{t("howItWorks.step3.title")}</h3>
                <p className="text-gray-500">{t("howItWorks.step3.description")}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                  ៤
                </div>
                <h3 className="text-xl font-bold mb-2">{t("howItWorks.step4.title")}</h3>
                <p className="text-gray-500">{t("howItWorks.step4.description")}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="try-now" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">{t("nav.tryNow")}</h2>
            <MedicalTranslator />
          </div>
        </section>

        <section id="symptom-checker" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">{t("symptoms.title")}</h2>
            <SymptomChecker />
          </div>
        </section>

        <section id="activity-monitor" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">{t("activity.title")}</h2>
            <ActivityMonitor />
          </div>
        </section>

        <section id="reviews" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">{t("reviews.title")}</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
                <div className="flex items-center mb-4">
                  <Image
                    src="/ai-generated-cambodian-man-1.jpg"
                    alt="សុខ វណ្ណា"
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">សុខ វណ្ណា</h3>
                    <p className="text-sm text-gray-500">{t("reviews.customer")}</p>
                  </div>
                </div>
                <StarRating rating={5} />
                <p className="text-gray-600 mt-2">{t("reviews.review1")}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
                <div className="flex items-center mb-4">
                  <Image
                    src="/ai-generated-cambodian-woman-1.jpg"
                    alt="ចាន់ សុភា"
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">ចាន់ សុភា</h3>
                    <p className="text-sm text-gray-500">{t("reviews.customer")}</p>
                  </div>
                </div>
                <StarRating rating={4} />
                <p className="text-gray-600 mt-2">{t("reviews.review2")}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
                <div className="flex items-center mb-4">
                  <Image
                    src="/ai-generated-cambodian-man-2.jpg"
                    alt="រស់ សុផានិត"
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">រស់ សុផានិត</h3>
                    <p className="text-sm text-gray-500">{t("reviews.customer")}</p>
                  </div>
                </div>
                <StarRating rating={5} />
                <p className="text-gray-600 mt-2">{t("reviews.review3")}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">{t("faq.title")}</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <details className="border-b pb-4">
                <summary className="font-semibold cursor-pointer">{t("faq.q1")}</summary>
                <p className="mt-2 text-gray-600">{t("faq.a1")}</p>
              </details>
              <details className="border-b pb-4">
                <summary className="font-semibold cursor-pointer">{t("faq.q2")}</summary>
                <p className="mt-2 text-gray-600">{t("faq.a2")}</p>
              </details>
              <details className="border-b pb-4">
                <summary className="font-semibold cursor-pointer">{t("faq.q3")}</summary>
                <p className="mt-2 text-gray-600">{t("faq.a3")}</p>
              </details>
              <details className="border-b pb-4">
                <summary className="font-semibold cursor-pointer">{t("faq.q4")}</summary>
                <p className="mt-2 text-gray-600">{t("faq.a4")}</p>
              </details>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">{t("about.title")}</h2>
            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="text-lg text-gray-600 mb-8">{t("about.description1")}</p>
              <p className="text-lg text-gray-600">{t("about.description2")}</p>
            </div>
            <h3 className="text-2xl font-bold text-center mb-6">{t("about.coreValues")}</h3>
            {/* Additional content for about section can be added here */}
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">{t("contact.title")}</h2>
            <div className="max-w-lg mx-auto">
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">{t("contact.name")}</Label>
                  <Input id="name" placeholder={t("contact.name.placeholder")} />
                </div>
                <div>
                  <Label htmlFor="email">{t("contact.email")}</Label>
                  <Input id="email" type="email" placeholder={t("contact.email.placeholder")} />
                </div>
                <div>
                  <Label htmlFor="message">{t("contact.message")}</Label>
                  <Textarea id="message" placeholder={t("contact.message.placeholder")} />
                </div>
                <Button className="w-full">{t("contact.send")}</Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <ChatBot />

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("footer.copyright")}</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            {t("footer.terms")}
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            {t("footer.privacy")}
          </Link>
        </nav>
      </footer>
    </div>
  )
}
