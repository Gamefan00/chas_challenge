import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const faqRefs = useRef([]);

  // Array of FAQ data containing questions and their corresponding answers
  const faqData = [
    {
      id: 1,
      question: "Vad är arbetshjälpmedel?",
      answer:
        "Arbetshjälpmedel är produkter, verktyg eller anpassningar som gör det möjligt för personer med funktionsnedsättning att utföra sitt arbete. Det kan vara allt från ergonomiska möbler till specialiserad programvara eller tekniska hjälpmedel.",
    },
    {
      id: 2,
      question: "Vem kan ansöka om arbetshjälpmedel?",
      answer:
        "Personer med funktionsnedsättning som är anställda, egenföretagare, eller som ska börja ett arbete eller arbetsmarknadsutbildning kan ansöka om arbetshjälpmedel.",
    },
    {
      id: 3,
      question: "Hur fungerar ett utredningssamtal?",
      answer:
        "Ett utredningssamtal är ett möte där dina behov kartläggs. En handläggare träffar dig och eventuellt din arbetsgivare för att diskutera vilka hjälpmedel som kan underlätta ditt arbete. Samtalet kan ske på arbetsplatsen eller digitalt.",
    },
    {
      id: 4,
      question: "Sparas mina uppgifter på Ansökshjälpen?",
      answer:
        "Ja, dina uppgifter sparas säkert och i enlighet med GDPR. De används endast för att hantera din ansökan och kommer inte att delas med tredje part utan ditt samtycke.",
    },
  ];

  // Initialize the refs array
  useEffect(() => {
    faqRefs.current = faqRefs.current.slice(0, faqData.length);
  }, [faqData.length]);

  // Function to toggle the visibility of an FAQ item's answer
  const toggleFaq = (id) => {
    setExpandedFaq(id === expandedFaq ? null : id); // Close if already open, otherwise open the clicked item
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, id, index) => {
    switch (e.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        toggleFaq(id);
        break;
      case "ArrowDown":
        e.preventDefault();
        const nextIndex = (index + 1) % faqData.length;
        faqRefs.current[nextIndex]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevIndex = (index - 1 + faqData.length) % faqData.length;
        faqRefs.current[prevIndex]?.focus();
        break;
      case "Home":
        e.preventDefault();
        faqRefs.current[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        faqRefs.current[faqData.length - 1]?.focus();
        break;
      default:
        break;
    }
  };

  return (
    <div className="card bg-base-100 w-full shadow-md">
      <div className="card-body p-12 md:py-24 lg:px-36">
        <motion.h2
          className="mb-8 text-center"
          id="faq-heading"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Vanliga frågor
        </motion.h2>
        <div className="w-full" role="region" aria-labelledby="faq-heading">
          {faqData.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="collapse-plus border-base-300 hover:bg-primary/10 border-b p-5 py-4 hover:rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Button to display the question and toggle the answer */}
              <button
                ref={(el) => (faqRefs.current[index] = el)}
                className="flex w-full cursor-pointer items-center justify-between text-left"
                onClick={() => toggleFaq(faq.id)}
                onKeyDown={(e) => handleKeyDown(e, faq.id, index)}
                aria-expanded={faq.id === expandedFaq}
                aria-controls={`faq-answer-${faq.id}`}
                id={`faq-question-${faq.id}`}
                tabIndex={0}
              >
                <motion.h4
                  animate={{
                    color: faq.id === expandedFaq ? "#0056b3" : "#111111",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.question}
                </motion.h4>
                {/* Animated arrow icon to indicate open/close state */}
                <motion.div
                  animate={{ rotate: faq.id === expandedFaq ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-primary"
                  aria-hidden="true"
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </button>

              {/* AnimatePresence to handle the animation of the answer's visibility */}
              <AnimatePresence>
                {faq.id === expandedFaq && (
                  <motion.div
                    id={`faq-answer-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${faq.id}`}
                    aria-live="polite"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="mt-2 py-3 pr-12 leading-relaxed"
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
