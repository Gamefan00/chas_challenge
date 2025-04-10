import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  // Array of FAQ data containing questions and their corresponding answers
  const faqData = [
    {
      question: "Vad är arbetshjälpmedel?",
      answer:
        "Arbetshjälpmedel är produkter, verktyg eller anpassningar som gör det möjligt för personer med funktionsnedsättning att utföra sitt arbete. Det kan vara allt från ergonomiska möbler till specialiserad programvara eller tekniska hjälpmedel.",
    },
    {
      question: "Vem kan ansöka om arbetshjälpmedel?",
      answer:
        "Personer med funktionsnedsättning som är anställda, egenföretagare, eller som ska börja ett arbete eller arbetsmarknadsutbildning kan ansöka om arbetshjälpmedel.",
    },
    {
      question: "Hur fungerar ett utredningssamtal?",
      answer:
        "Ett utredningssamtal är ett möte där dina behov kartläggs. En handläggare träffar dig och eventuellt din arbetsgivare för att diskutera vilka hjälpmedel som kan underlätta ditt arbete. Samtalet kan ske på arbetsplatsen eller digitalt.",
    },
    {
      question: "Sparas mina uppgifter på Ansökshjälpen?",
      answer:
        "Ja, dina uppgifter sparas säkert och i enlighet med GDPR. De används endast för att hantera din ansökan och kommer inte att delas med tredje part utan ditt samtycke.",
    },
  ];

  // Function to toggle the visibility of an FAQ item's answer
  const toggleFaq = (index) => {
    setOpenIndex(index === openIndex ? null : index); // Close if already open, otherwise open the clicked item
  };

  return (
    <div className="card bg-base-100 w-full shadow-md">
      <div className="card-body p-12 md:px-36 md:py-24">
        <motion.h6
          className="mb-8 text-center text-4xl font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Vanliga frågor
        </motion.h6>
        <div className="w-full">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              className="collapse-plus border-base-300 cursor-pointer border-b py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }} // Staggered animation for each FAQ item
              onClick={() => toggleFaq(index)}
            >
              {/* Button to display the question and toggle the answer */}
              <button
                className="flex w-full cursor-pointer items-center justify-between text-left"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  toggleFaq(index);
                }}
              >
                <h3 className="font-medium text-gray-900">{faq.question}</h3>
                {/* Animated arrow icon to indicate open/close state */}
                <motion.div
                  className="text-primary"
                  animate={{ rotate: index === openIndex ? 180 : 0 }} // Rotate arrow when open
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </motion.div>
              </button>

              {/* AnimatePresence to handle the animation of the answer's visibility */}
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }} // Initial state when hidden
                  animate={{ opacity: 1 }} // Animate to visible state
                  exit={{ opacity: 0 }} // Animate to hidden state when removed
                  transition={{ duration: 0.2 }}
                  className={`mt-2 overflow-hidden transition-all duration-200 ${
                    index === openIndex ? "max-h-96" : "max-h-0"
                  }`} // Dynamically set max height based on open state
                >
                  <motion.p
                    className="w-full pr-12 leading-relaxed text-gray-600"
                    initial={{ y: -5 }} // Slide in from above
                    animate={{ y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {faq.answer}
                  </motion.p>{" "}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
