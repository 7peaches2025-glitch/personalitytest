import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS_PER_PAGE = 4;

const Test: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const currentQuestions = questions.slice(
        currentPage * QUESTIONS_PER_PAGE,
        (currentPage + 1) * QUESTIONS_PER_PAGE
    );

    const handleAnswer = (questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            // Finish
            navigate('/report', { state: { answers } });
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo(0, 0);
        } else {
            navigate('/');
        }
    };

    const isPageComplete = currentQuestions.every(q => answers[q.id] !== undefined);
    // @ts-ignore
    const progress = (Object.keys(answers).length / questions.length) * 100;

    // Helper to get option labels based on question ID
    const getOptions = (questionId: number) => {
        if (questionId >= 11 && questionId <= 15) {
            return [
                { val: 1, label: "从来没有" },
                { val: 2, label: "几乎没有" },
                { val: 3, label: "有时" },
                { val: 4, label: "大多数时候" },
                { val: 5, label: "总是" }
            ];
        }
        return [
            { val: 1, label: "完全不符" },
            { val: 2, label: "不太符合" },
            { val: 3, label: "中立/不确定" },
            { val: 4, label: "比较符合" },
            { val: 5, label: "完全符合" }
        ];
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] py-12 px-4 md:px-6 flex flex-col items-center">
            {/* Header / Progress */}
            <div className="w-full max-w-2xl mb-12 flex items-center justify-between">
                <span className="text-sm font-serif italic text-[var(--color-secondary)]">
                    Part {currentPage + 1} of {totalPages}
                </span>
                <div className="h-[2px] w-32 bg-gray-200 ml-4 flex-1 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[var(--color-accent)] transition-all duration-500"
                        style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                    />
                </div>
            </div>

            <div className="w-full max-w-2xl space-y-16 mb-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-16"
                    >
                        {currentQuestions.map((q) => {
                            const options = getOptions(q.id);
                            return (
                                <div key={q.id} className="space-y-6">
                                    <h3 className="text-xl md:text-2xl font-serif text-[var(--color-primary)] font-medium leading-relaxed">
                                        {q.id}. {q.text}
                                    </h3>

                                    <div className="grid grid-cols-5 gap-2 md:gap-4">
                                        {options.map((opt) => (
                                            <button
                                                key={opt.val}
                                                onClick={() => handleAnswer(q.id, opt.val)}
                                                className={`
                                                  flex flex-col items-center justify-center py-4 rounded-[var(--radius-md)] border transition-all duration-200
                                                  ${answers[q.id] === opt.val
                                                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md transform scale-[1.02]'
                                                        : 'bg-white border-gray-200 text-gray-500 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'}
                                                `}
                                            >
                                                <span className="text-lg font-bold mb-1">{opt.val}</span>
                                                <span className="text-[10px] md:text-xs opacity-80">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons Area */}
            <div className="w-full max-w-2xl flex justify-between items-center mt-auto pt-8 border-t border-gray-200/50">
                <button
                    onClick={handlePrevious}
                    className="flex items-center gap-2 text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors px-4 py-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium tracking-wide">上一页</span>
                </button>

                <button
                    onClick={handleNext}
                    disabled={!isPageComplete}
                    className={`
                        group flex items-center gap-3 px-8 py-3 rounded-[var(--radius-md)] border text-sm font-bold uppercase tracking-widest transition-all
                        ${isPageComplete
                            ? 'border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white cursor-pointer'
                            : 'border-gray-200 text-gray-300 cursor-not-allowed'}
                    `}
                >
                    {currentPage === totalPages - 1 ? '完成测试' : '下一页'}
                    <ArrowRight className={`w-4 h-4 ${isPageComplete ? 'group-hover:translate-x-1 transition-transform' : ''}`} />
                </button>
            </div>
        </div>
    );
};

export default Test;
