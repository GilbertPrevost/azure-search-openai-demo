
// import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { createPdf } from "pdfmake/build/pdfmake";
import { pdfMake } from "pdfmake/build/vfs_fonts";
import { AskResponse } from "../../api";


// Register the PDF fonts
// pdfFonts.pdfMake.vfs = pdfFonts.pdfMake.vfs || {};
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface PdfResult {
  pdfbuffer: Buffer;
  fileName: string;
}

const headerStyle = "headerStyle";
const questionStyle = "questionStyle";
const answerStyle = "answerStyle";
const footerStyle = "footerStyle";

const styles = {
  [headerStyle]: { fontSize: 16, bold: true, Alignment: 'center' },
  [questionStyle]: { fontSize: 12, bold: true, Alignment: 'left' },
  [answerStyle]: { fontSize: 12, Alignment: 'right'},
  [footerStyle]: { fontSize: 9, bold: true, Alignment: 'center' },
 
};


const PdfGenerator = (history: [string, AskResponse][],Metadata:string,SessionTime:number): Promise<PdfResult> => {
  return new Promise((resolve, reject) => {
    try {
      const content: { text: string; style: string }[] = [];
      
      const formatDateTime = () => {
        const currentDateTime = new Date();
        const locale = navigator.language;
      
        const formattedDate = new Intl.DateTimeFormat(locale).format(currentDateTime);
      
        const formattedTime = new Intl.DateTimeFormat(locale, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(currentDateTime);
      
        // Get the full DateTime string including timezone
        const dateTimeWithTimeZone = new Intl.DateTimeFormat(locale, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZoneName: 'short',
        }).format(currentDateTime);
      
        // Extract just the timezone part by splitting on spaces and getting the last part
        const timeZoneParts = dateTimeWithTimeZone.split(' ');
        const timeZone = timeZoneParts[timeZoneParts.length - 1];
      
        return `${formattedDate} ${formattedTime} ${timeZone}`;
      };
      
      
      const formatDate = () => {
        const currentDateTime = new Date();
      
        //const formattedDate = new Intl.DateTimeFormat('en-US').format(currentDateTime);
      
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: '2-digit'
        }).format(currentDateTime);
      
        return `${formattedDate}`;
      };

      // debugger
      //   const MessageDateTime = ChatDateTime.forEach((message) => {
      //   // Check if msgDateTime exists
      //   if (message.msgDateTime) {
      //     // Push the msgDateTime content
      //     content.push({ text: message.msgDateTime,style: answerStyle,});
      //   }     
      // });


      let chatLength = history.length;

    
      content.push({
        text: `\nUser: _ _ _ _ _\n`,
        style: answerStyle,
      });

      content.push({
        text: `Topic: ${Metadata} \n`,
        style: answerStyle,
      });

      
      const hours = Math.floor(SessionTime / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((SessionTime % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((SessionTime % (1000 * 60)) / 1000).toString().padStart(2, '0');     
          

      content.push({
        text: `Chat Duration: ${hours}:${minutes}:${seconds}  \n`,
        style: answerStyle,
      });

      content.push({
        text: `Questions Asked: ${chatLength} \n`,
        style: answerStyle,
      });

      let totalQuestionWords = 0;
      let totalAnswerWords = 0;
      debugger
      for (let i = 0; i < chatLength; i++) {
        const [question, answer] = history[i];
        // Split on spaces to get an array of words, then count the length of the array
        totalQuestionWords += question.split(' ').length;
        totalAnswerWords += answer.answer.split(' ').length;
        
      }
      
      const averageQuestionWords = Math.floor(totalQuestionWords / chatLength);
      const averageAnswerWords = Math.floor(totalAnswerWords / chatLength);
      

      content.push({
        text: `Average Question Length: ${averageQuestionWords} Words\n`,
        style: answerStyle,
      });

      content.push({
        text: `Average Answer Length: ${averageAnswerWords} Words\n\n`,
        style: answerStyle,
      });

      let j = 1;

      for (let i = 0; i < chatLength; i++) {
        const [question, answer] = history[i];
       
        // const questionTime = ChatDateTime[j];
        // j++
        // const answerTime = ChatDateTime[j];
        // j++

         const questionTime = "";
        j++
        const answerTime = "";
        j++

       // content.push({ text: "User Question "+""+(i+1)+": "+ question, style: answerStyle });
        content.push({ text: "User Question "+""+(i+1)+": "+questionTime, style: questionStyle });
        content.push({ text:  question, style: answerStyle });
       // content.push({ text: question, style: answerStyle });
        content.push({ text: "\n", style: "" }); 
        //content.push({ text:  "Assistant Answer "+""+(i+1)+": "+answer, style: answerStyle });
        content.push({ text:  "Assistant Answer "+""+(i+1)+": "+answerTime, style: questionStyle });
        content.push({ text:  answer.answer, style: answerStyle });
       // content.push({ text: answer, style: answerStyle });
        content.push({ text: "\n\n", style: "" }); // Add an empty style for the line break
        
      }
     // msgTime()

      const docDefinition : TDocumentDefinitions = {
        // info: {
        //   title: 'TechUnity AI Assistant Chat History',
        //   author: 'TechUnity, Inc',
        //   subject: 'User Chat Conversation',
        //   keywords: 'TechUnity, AI, NLP, Conversational, Chatbot',
        //   },
        compress: true,
        content,
        styles,
        pageSize:'A4',
        pageMargins:[40,60,20,60],
     
        header: function () {
          return {
            columns: [
              {   text: `Chat Transcript ${formatDateTime()} \n\n`,  alignment: 'center' , style: headerStyle, margin: [0, 30, 0, 0] },
            ],
           
            
          };
        },
        



        footer: function (currentPage: number, pageCount: number) {
          return {
            columns: [
              { text:"     "+ formatDate(), style: 'normal', alignment: 'left' , margin: [42, 30, 0, 0] },
              { text:"Copyright © 2023 TechUnity, Inc. \nAll Rights Reserved.", style: 'normal', alignment: 'center' , margin: [0, 30, 0, 0] },
              { text: ` Page ${currentPage} of ${pageCount}`, style: 'normal', alignment: 'right' ,margin: [0, 30, 42, 0]},
            ],
         
            styles: "footer",
          };
        },
      };


      // Generate a timestamp
      const timestamp = new Date().toISOString().replace(/[:.-]/g, "");

      // Create the PDF
      const pdfDocGenerator = createPdf(docDefinition);

      pdfDocGenerator.getBuffer((buffer) => {
        const fileName = `Chat Transcript ${formatDateTime()}.pdf`;
        console.log("PDF generated successfully");
        resolve({ pdfbuffer: buffer, fileName });
      });
    } catch (error) {
      console.error("Failed to generate PDF", error);
      reject(error);
    }
  });
};

export default PdfGenerator;
