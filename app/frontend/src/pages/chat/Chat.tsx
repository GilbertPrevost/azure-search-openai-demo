import { useRef, useState, useEffect } from "react";
import { Checkbox, Panel, DefaultButton, TextField, SpinButton } from "@fluentui/react";
import { SparkleFilled } from "@fluentui/react-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./Chat.module.css";

import { chatApi, Approaches, AskResponse, ChatRequest, ChatTurn } from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import { AnalysisPanel, AnalysisPanelTabs } from "../../components/AnalysisPanel";
import { SettingsButton } from "../../components/SettingsButton";
import { ClearChatButton } from "../../components/ClearChatButton";
import MetadataList from "../../components/MetaDataList/metadatalist";
import DropList from "../../components/DropList/dropdownlist";
import RatingComponent from "../../components/ratingmessage/ratingmessage";
import PdfGenerator from "../../components/PdfGenerators/PdfGenerators";

const Chat = () => {
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [promptTemplate, setPromptTemplate] = useState<string>("");
    const [retrieveCount, setRetrieveCount] = useState<number>(3);
    const [useSemanticRanker, setUseSemanticRanker] = useState<boolean>(true);
    const [useSemanticCaptions, setUseSemanticCaptions] = useState<boolean>(false);
    const [excludeCategory, setExcludeCategory] = useState<string>("");
    const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState<boolean>(false);

    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<unknown>();

    const [activeCitation, setActiveCitation] = useState<string>();
    const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] = useState<AnalysisPanelTabs | undefined>(undefined);

    const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
    const [answers, setAnswers] = useState<[user: string, response: AskResponse][]>([]);
    const [history, setHistory] = useState<[string,string][]>([]);
    const [singlehistory, setsingleHistory] = useState<[string,string] | undefined>();

    const makeApiRequest = async (question: string) => {
        lastQuestionRef.current = question;

        error && setError(undefined);
        setIsLoading(true);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);

        try {
            const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
            const request: ChatRequest = {
                history: [...history, { user: question, bot: undefined }],
                approach: Approaches.ReadRetrieveRead,
                overrides: {
                    promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
                    excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
                    top: retrieveCount,
                    semanticRanker: useSemanticRanker,
                    semanticCaptions: useSemanticCaptions,
                    suggestFollowupQuestions: useSuggestFollowupQuestions
                }
            };
            const result = await chatApi(request);
            setAnswers([...answers, [question, result]]);
            setsingleHistory([question,result.answer]);
           
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        setAnswers([]);
    };

    interface DropListItem {
        id: number;
        uuid: string;
        label: string;
      }

    const items = [
        // { id: 1, uuid: "2279b2a0-91af-4f93-ab64-106cbb91dcdd", label: "LinkedIn" },
        // {
        //   id: 2,
        //   uuid: "a96da5f0-9dc8-4a80-8242-999bb519c6dd",
        //   label: "Corporate Governance",
        // },
        {
          id: 1,
          uuid: "32d85331-e25e-4f87-acf7-c67ada71b788",
          label: "Pedigree Manuals",
        },
        // {
        //   id: 4,
        //   uuid: "cb3a924a-5ec0-4453-bc09-0575e11b514e",
        //   label: "d-Wise Blur User Manuals",
        // },
      ];

    const [selectedRootObject, setSelectedRootObject] = useState<string>("32d85331-e25e-4f87-acf7-c67ada71b788");

     // setSelectedRootObject("32d85331-e25e-4f87-acf7-c67ada71b788");

    const [selectedRootLabel, setSelectedRootLabel] = useState<string>("Pedigree Manuals");

    //SelectedUUID("2279b2a0-91af-4f93-ab64-106cbb91dcdd");
   
  
    const handleDropListSelect = (selectedItem: DropListItem) => {
      setSelectedRootObject(selectedItem.uuid);
     // SelectedUUID(selectedItem.uuid);
      setSelectedRootLabel(selectedItem.label);
     // handleReset();
      //handleLabelChange(selectedItem.label);
    };

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);

    const onPromptTemplateChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPromptTemplate(newValue || "");
    };

    const onRetrieveCountChange = (_ev?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
        setRetrieveCount(parseInt(newValue || "3"));
    };

    const onUseSemanticRankerChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticRanker(!!checked);
    };

    const onUseSemanticCaptionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticCaptions(!!checked);
    };

    const onExcludeCategoryChanged = (_ev?: React.FormEvent, newValue?: string) => {
        setExcludeCategory(newValue || "");
    };

    const onUseSuggestFollowupQuestionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSuggestFollowupQuestions(!!checked);
    };

    const onExampleClicked = (example: string) => {
        makeApiRequest(example);
    };

    const onShowCitation = (citation: string, index: number) => {
        if (activeCitation === citation && activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveCitation(citation);
            setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
        }

        setSelectedAnswer(index);
    };

    const onToggleTab = (tab: AnalysisPanelTabs, index: number) => {
        if (activeAnalysisPanelTab === tab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveAnalysisPanelTab(tab);
        }

        setSelectedAnswer(index);
    };

    return (
        <div className={styles.container}>
            <div className={styles.commandsContainer}>
                {/* <ClearChatButton className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading} /> */}
                {/* <SettingsButton className={styles.commandButton} onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)} /> */}
            </div>

            <div className={styles.chatRoot}>
                <div className={styles.headKnowleadgebase}>
                    <nav className={styles.DialogTest}>
                        <h2 className={styles.DialogFont}>Knowledgebase</h2>
                    </nav>
                    <DropList
                        items={items}
                        storageKey="selectedKnowledgebase"
                        onItemSelect={handleDropListSelect} 
                        selectedLabel={"Pedigree Manuals"}              //  selectedLabel={selectedLabel}
                     />
              
                    <div className={styles.metadatalist}>
                        <div className={styles.navmetadatalist}>
                            <div className={styles.fontmetadata}>{`Metadata: ${selectedRootLabel}`}</div>
                        </div>
                    </div>
                    <MetadataList rootObjectName={selectedRootObject} />
                </div>
                <div className={styles.chatContainer}>
                    {/* <div className=""> */}
                    {/* <div className={styles.headDialog1}>
                        <nav className={styles.DialogTest}>
                            <h2 className={styles.DialogFont}>Dialog</h2>Hi, I am Eve. Your AI Assitant.
                        </nav>
                    </div> */}
                    <div className={styles.headDialog1}>
                        <div className={styles.DialogTest}>
                            <div className={styles.DialogFont}>Dialog</div>
                        </div>
                        <div className={styles.DialogTest}>
                            <div className={styles.DialogText}>Hi, I am Eve. Your AI Assistant.</div>
                        </div>
                    </div>
                    {/* </div> */}

                    <div className={styles.chatContainer1}>
                        {!lastQuestionRef.current ? (
                            <div className={styles.chatEmptyState}>
                                <img src="/Tu Logo.png" aria-label="Chat logo" height="120" />
                                {/* <SparkleFilled fontSize={"120px"} primaryFill={"rgba(115, 118, 225, 1)"} aria-hidden="true" aria-label="Chat logo" /> */}
                                <h1 className={styles.chatEmptyStateTitle}>Chat with your data</h1>
                                <h2 className={styles.chatEmptyStateSubtitle}>Ask anything or try an example</h2>
                                <ExampleList onExampleClicked={onExampleClicked} />
                            </div>
                        ) : (
                            <div className={styles.chatMessageStream}>
                                {answers.map((answer, index) => (
                                    <div key={index}>
                                        <UserChatMessage message={answer[0]} />
                                        <div className={styles.chatMessageGpt}>
                                            <Answer
                                                key={index}
                                                answer={answer[1]}
                                                isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
                                                onCitationClicked={c => onShowCitation(c, index)}
                                                onThoughtProcessClicked={() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                                onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                                onFollowupQuestionClicked={q => makeApiRequest(q)}
                                                showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                            />
                                        </div>
                                        <div className={styles.answerRatings}>
                                        <RatingComponent ratings={[]} handleRatings={function (rating: string[]): void {
                                                throw new Error("Function not implemented.");
                                            } } index={0} ratings2={[]} />
                                        {/* handleRatings={handleRatings}
                              ratings={ratings}
                              index={(indexCT/2)-1}
                              ratings2={ratings2} */}
                                            <button className={styles.citationbutton} onClick={() => onShowCitation("", index)}>
                                                {"Show Citations"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <>
                                        <UserChatMessage message={lastQuestionRef.current} />
                                        <div className={styles.chatMessageGptMinWidth}>
                                            <AnswerLoading />
                                        </div>
                                        {/* <div className={styles.answerRatings}>
                                            Satisfaction Rating&nbsp;
                                            <button onClick={() => true} className={styles.Ratingsbutton}>
                                                <i className={styles.Ratingsicon} aria-hidden="true"></i>
                                            </button>
                                            <button className={styles.citationbutton} onClick={() => ""}>
                                                {"Show Citations"}
                                            </button>
                                        </div> */}
                                    </>
                                )}
                                {error ? (
                                    <>
                                        <UserChatMessage message={lastQuestionRef.current} />
                                        <div className={styles.chatMessageGptMinWidth}>
                                            <AnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
                                        </div>
                                    </>
                                ) : null}
                                <div ref={chatMessageStreamEnd} />
                            </div>
                        )}
                    </div>
                    <div className={styles.center100}>
                        <div className={styles.questioncenter100}>
                            <nav className={styles.navquestioncenter100}>
                                <div className={styles.headquestioncenter100}>Question</div>
                            </nav>
                        </div>
                    </div>

                    <div className={styles.chatInput}>
                        <QuestionInput
                            clearOnSend
                            placeholder={isLoading ? "Waiting for response..." : "Type your questions here."}
                            disabled={isLoading}
                            onSend={question => makeApiRequest(question)}
                            clearChat={clearChat}
                            answers={answers}
                            selectedRootLabel={selectedRootLabel}
                        />
                    </div>
                </div>

                <div className={styles.footer}>
                    <div>© 2023 TechUnity, Inc. All Rights Reserved.</div>
                </div>

                {activeAnalysisPanelTab && (
                    <AnalysisPanel
                        className={styles.chatAnalysisPanel}
                        activeCitation={activeCitation}
                        onActiveTabChanged={x => onToggleTab(x, selectedAnswer)}
                        citationHeight="810px"
                        answer={answers[selectedAnswer][1]}
                        activeTab={activeAnalysisPanelTab}
                    />
                )}
                {activeAnalysisPanelTab == undefined && (
                    <AnalysisPanel
                        className={styles.chatAnalysisPanel}
                        activeCitation={activeCitation}
                        onActiveTabChanged={x => onToggleTab(x, selectedAnswer)}
                        citationHeight="810px"
                        activeTab={AnalysisPanelTabs.ThoughtProcessTab}
                        answer={{
                            answer: "",
                            thoughts: null,
                            data_points: [],
                            error: undefined
                        }} // answer={answers[selectedAnswer][1]}
                        // activeTab={activeAnalysisPanelTab}
                    />
                )}

                <Panel
                    headerText="Configure answer generation"
                    isOpen={isConfigPanelOpen}
                    isBlocking={false}
                    onDismiss={() => setIsConfigPanelOpen(false)}
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={() => <DefaultButton onClick={() => setIsConfigPanelOpen(false)}>Close</DefaultButton>}
                    isFooterAtBottom={true}
                >
                    <TextField
                        className={styles.chatSettingsSeparator}
                        defaultValue={promptTemplate}
                        label="Override prompt template"
                        multiline
                        autoAdjustHeight
                        onChange={onPromptTemplateChange}
                    />

                    <SpinButton
                        className={styles.chatSettingsSeparator}
                        label="Retrieve this many documents from search:"
                        min={1}
                        max={50}
                        defaultValue={retrieveCount.toString()}
                        onChange={onRetrieveCountChange}
                    />
                    <TextField className={styles.chatSettingsSeparator} label="Exclude category" onChange={onExcludeCategoryChanged} />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticRanker}
                        label="Use semantic ranker for retrieval"
                        onChange={onUseSemanticRankerChange}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticCaptions}
                        label="Use query-contextual summaries instead of whole documents"
                        onChange={onUseSemanticCaptionsChange}
                        disabled={!useSemanticRanker}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSuggestFollowupQuestions}
                        label="Suggest follow-up questions"
                        onChange={onUseSuggestFollowupQuestionsChange}
                    />
                </Panel>
            </div>
        </div>
    );
};

export default Chat;
