import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, Check } from 'lucide-react'

interface Task2Props {
  correctCode?: string
  onSuccess?: () => void
  onError?: () => void
}

export default function Task2({
  correctCode = '123456',
  onSuccess,
  onError
}: Task2Props) {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value
    // Only allow single digit 0-9
    if (value.length > 0 && /^[0-9]$/.test(value)) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)
      setIsError(false)

      // Move to next box
      if (index < 5) {
        setActiveIndex(index + 1)
        inputRefs.current[index + 1]?.focus()
      } else {
        // Check if code is complete
        const enteredCode = newCode.join('')
        if (enteredCode === correctCode) {
          setIsSuccess(true)
          setActiveIndex(-1)
          inputRefs.current[index]?.blur()
          onSuccess?.()
        } else {
          setIsError(true)
          setShake(true)
          onError?.()
          setTimeout(() => {
            setShake(false)
            // Reset and move highlight back to start
            setCode(['', '', '', '', '', ''])
            setActiveIndex(0)
            inputRefs.current[0]?.focus()
          }, 500)
        }
      }
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (code[index] === '' && index > 0) {
        // Move to previous box if current is empty
        const newCode = [...code]
        newCode[index - 1] = ''
        setCode(newCode)
        setActiveIndex(index - 1)
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current box
        const newCode = [...code]
        newCode[index] = ''
        setCode(newCode)
      }
      setIsError(false)
    } else if (e.key >= '0' && e.key <= '9') {
      // Allow numeric keys to proceed (handled by onChange)
      // But prevent if box already has a digit
      if (code[index] !== '') {
        e.preventDefault()
      }
    } else if (
      e.key !== 'Tab' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight' &&
      e.key !== 'ArrowUp' &&
      e.key !== 'ArrowDown'
    ) {
      // Prevent non-numeric characters
      e.preventDefault()
    }
  }

  const handleFocus = (index: number) => {
    setActiveIndex(index)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newCode = [...code]
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newCode[i] = pastedData[i]
      }
      setCode(newCode)
      setIsError(false)

      if (pastedData.length === 6) {
        if (pastedData === correctCode) {
          setIsSuccess(true)
          setActiveIndex(-1)
          inputRefs.current[5]?.blur()
          onSuccess?.()
        } else {
          setIsError(true)
          setShake(true)
          onError?.()
          setTimeout(() => {
            setShake(false)
            setCode(['', '', '', '', '', ''])
            setActiveIndex(0)
            inputRefs.current[0]?.focus()
          }, 500)
        }
      } else {
        const nextIndex = Math.min(pastedData.length, 5)
        setActiveIndex(nextIndex)
        inputRefs.current[nextIndex]?.focus()
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Icon Circle */}
        <motion.div
          className="mx-auto mb-12 flex size-24 items-center justify-center rounded-full bg-blue-100"
          animate={isSuccess ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="mail"
                initial={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Mail className="size-10 text-blue-500" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Check className="size-12 text-blue-500" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Title and Description */}
        <h1 className="mb-3 text-center">
          We&apos;ve emailed you a verification code
        </h1>
        <p className="mb-12 text-center text-gray-500">
          Please enter the code we sent you below.
        </p>

        {/* Code Input Boxes */}
        <motion.div
          className="mb-8 flex items-center justify-center gap-4"
          animate={
            shake
              ? {
                x: [0, -10, 10, -10, 10, 0]
              }
              : {}
          }
          transition={{ duration: 0.5 }}
        >
          {code.map((digit, index) => (
            <div key={index} className="relative">
              {/* Separator after 3rd box */}
              {index === 3 && (
                <div className="absolute -left-6 top-1/2 h-0.5 w-3 -translate-y-1/2 bg-gray-300" />
              )}

              <div className="relative">
                {/* Animated highlight outline */}
                {activeIndex === index && !isSuccess && (
                  <motion.div
                    layoutId="highlight"
                    className={`absolute inset-0 rounded-2xl ${isError
                        ? 'border-4 border-red-500'
                        : 'border-4 border-blue-500'
                      }`}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}

                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={() => handleFocus(index)}
                  onPaste={handlePaste}
                  aria-label={`Verification code digit ${index + 1}`}
                  className="h-24 w-20 cursor-pointer rounded-2xl border-4 border-transparent bg-gray-100 text-center text-2xl font-semibold text-transparent caret-transparent transition-colors focus:outline-none"
                />

                {/* Animated digit display */}
                <AnimatePresence>
                  {digit && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    >
                      <span className="text-2xl font-semibold text-gray-900">
                        {digit}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {isError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 text-center text-red-500"
            >
              Invalid verification code
            </motion.p>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {isSuccess && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 text-center text-green-600"
            >
              Verification successful!
            </motion.p>
          )}
        </AnimatePresence>

        {/* Resend Link */}
        <p className="text-center text-gray-500">
          Didn&apos;t receive a code?{' '}
          <button className="text-gray-900 hover:underline">Resend</button>
        </p>
      </div>
    </div>
  )
}
