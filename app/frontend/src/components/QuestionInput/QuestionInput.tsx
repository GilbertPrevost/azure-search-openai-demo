import { ChangeEvent, useState } from "react";
import { Stack, TextField } from "@fluentui/react";
import { Send28Filled } from "@fluentui/react-icons";
import Modal from "react-modal";
import styles from "./QuestionInput.module.css";
import PdfGenerator from "../../components/PdfGenerators/PdfGenerators";
import { AskResponse } from "../../api";

interface Props {
    onSend: (question: string) => void;
    disabled: boolean;
    placeholder?: string;
    clearOnSend?: boolean;
    clearChat: () => void;
    answers:[user: string, response: AskResponse][];
    selectedRootLabel:string;
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, clearChat, answers ,selectedRootLabel}: Props) => {
    const [question, setQuestion] = useState<string>("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);

    const [StartTime, setStartTime] = useState<string>("");
    const [EndTime, setEndTime] = useState<string>("");
    const [sessionTime, setSessionTime] = useState(0);
    const [ratings1, setRatings1] = useState<string>("");

    const formatDateTime = () => {
        const currentDateTime = new Date();
        const formattedDate = currentDateTime.toLocaleDateString();
        const formattedTime = currentDateTime.toLocaleTimeString();
        return `${formattedDate} ${formattedTime}`;  
      };

      const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
    
        return `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };

      const arrayBufferToBuffer = (ab: ArrayBuffer) => {
        let buffer = new Buffer(ab.byteLength);
        let view = new Uint8Array(ab);
        for (let i = 0; i < buffer.length; ++i) {
          buffer[i] = view[i];
        }
        return buffer;
      };

      
    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
    
        // Very simple email validation.
        // You might want to use a more complete validation logic.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValidEmail(emailRegex.test(newEmail));
      };
    const sendQuestion = () => {
        if (disabled || !question.trim()) {
            return;
        }

        onSend(question);

        if (clearOnSend) {
            setQuestion("");
        }
    };


    const ChatSubmitWrapper = async (email: string) => {
   

        let EndTimeSession = formatDateTime();
        setEndTime(EndTimeSession);
    
           debugger
    
        const startTime = new Date(StartTime);
        const endTime = new Date(EndTimeSession);
    
        const timeDifference = endTime.getTime() - startTime.getTime();
    
        
        try {
          const SessionTimer = formatTime(sessionTime);
       //   const messageTimer = [];
    
        //   for (let i = 0; i < messages.length; i++) {
    
        //     const messageData = messages[i].msgDateTime;
        //     messageTimer.push(messageData);
          
        //   }
    
        //  const pdfData = await PdfGenerator(history,selectedRootLabel,timeDifference,messageTimer);

          const pdfData = await PdfGenerator(answers,selectedRootLabel,timeDifference);
          debugger
          const buffer = arrayBufferToBuffer(pdfData.pdfbuffer);
    
          const response = await fetch('/api/mail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiver: email, filename: pdfData.fileName, pdfData: pdfData.pdfbuffer.toString('base64') }),
          });
       
          setModalIsOpen(false);
        } catch (error) {
          console.error("Failed to submit chat", error);
        }
    
        //UpdateHistory(uuidv4(), JSON.stringify(history),ratings1);
      //  setRatings1('');
        // handleReset();
        clearChat();
      };

    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    const NoTrans = () => {

        clearChat();
        setModalIsOpen(false);

    }

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (!newValue) {
            setQuestion("");
        } else if (newValue.length <= 1000) {
            setQuestion(newValue);
        }
    };

    const sendQuestionDisabled = disabled || !question.trim();
   
    return (
        <Stack horizontal className={styles.questionInputContainer}>
            <TextField
                className={styles.questionInputTextArea}
                placeholder={placeholder}
                resizable={false}
                borderless
                rows={1}
                value={question}
                onChange={onQuestionChange}
                onKeyDown={onEnterPress}
            />
            <div className={styles.questionInputButtonsContainer}>
                <div
                    className={`${styles.questionInputSendButton} ${sendQuestionDisabled ? styles.questionInputSendButtonDisabled : ""}`}
                    aria-label="Ask question button"
                    onClick={sendQuestion}
                >
                    <button type="submit" className={styles.generatebutton}>
                        <svg viewBox="0 0 20 20" className={styles.svgicon} xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                    </button>{" "}
                    <button type="reset" className={styles.generatebuttonCancel} onClick={clearChat}>
                        Clear
                    </button>{" "}
                    <button type="button" className={styles.generatebuttonEnd} onClick={() => setModalIsOpen(true)}>
                        End
                    </button>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={() => setModalIsOpen(false)}
                        style={{
                            content: {
                                top: "50%",
                                left: "50%",
                                right: "auto",
                                bottom: "auto",
                                marginRight: "-50%",
                                transform: "translate(-50%, -50%)",
                                height: "250px",
                                width: "500px"
                            }
                        }}
                    >
                        <div className={styles.endMEssage1}>
                            You're closing this conversation. Would you like to receive a transcript? If "Yes" then please enter the recipient email and click
                            “End: With Transcript” OR click “End: No Transcript” to close this chat OR “Return” to continue your dialog.
                        </div>
                        <div>
                            <input
                                type="email"
                                 value={email}
                                 onChange={handleEmailChange}
                                className={styles.endMEssage2}
                                placeholder="Enter your email"
                            />
                            {!isValidEmail && (
                        <p className={styles.textred}>
                          Please enter a valid email
                        </p>
                      )}
                        </div>

                        <div className={styles.endMEssage3}>
                            <button
                                // onClick={ChatSubmitWrapper}
                                onClick={() => ChatSubmitWrapper(email)}
                                className={styles.endMEssage4}
                            >
                                End: With Transcript
                            </button>{" "}
                            <button
                                onClick={NoTrans}
                                // onClick={handleReset}
                                className={styles.endMEssage4}
                            >
                                End: No Transcipt
                            </button>{" "}
                            <button
                                onClick={() => setModalIsOpen(false)}
                                className={styles.endMEssage5}
                            >
                                Return
                            </button>
                        </div>
                    </Modal>
                    {/* <Send28Filled primaryFill="rgba(115, 118, 225, 1)" /> */}
                </div>
            </div>
        </Stack>
    );
};
