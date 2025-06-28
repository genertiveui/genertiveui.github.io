import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaFileAlt, FaGithub, FaBook } from 'react-icons/fa';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { ThemeToggle } from '~/components/ui/theme-toggle';
import { LeftPane } from './LeftPane';
import { Carousel } from './Carousel';
import { App } from './App';
import { FullscreenModal } from './FullscreenModal';
import { DynamicDataProvider } from '~/context/DynamicDataContext';
import dynamicData from '~/data/dynamicData.json';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '~/styles/demo.css';

// TypeScript interfaces
interface CarouselItem {
    id: number;
    text: string;
    value: string;
}

// Update this interface to match the actual JSON structure
interface ExamplePrompts {
    short: string[];
    long: string[];
}

interface Example {
    query: string;
    oursUrl: string;
    textUrl: string;
    comment: string;
    interface: string;
    model: string;
    commentLength: number;
}

interface Suggestion {
    id: number;
    title: string;
    description: string;
    activity: string;
    oursUrl: string;
    textUrl: string;
    interface: string;
    model: string;
    chats: Array<{
        role: string;
        message: string;
    }>;
}

// Update DynamicData interface to match the actual JSON structure
interface DynamicData {
    activity: string;
    gif: string;
    carousel: CarouselItem[][];
    examples: Example[];
    textUrls: Example[];
    suggestions?: Suggestion[]; // Make it optional since JSON doesn't have it
}

// Demo screenshots from evaluation study
const screenshots = [
    { src: '/images/demo/1_image.png', caption: 'EcoExplorer food web educational interface showing interactive ecosystem learning with drag-and-drop organism connections, step-by-step tutorials, and embedded quizzes for hands-on ecological understanding.' },
    { src: '/images/demo/2_image.png', caption: 'Technical comparison interface for REST vs GraphQL featuring tabbed navigation, side-by-side code examples, and interactive deep-dive sections for API versioning strategies and implementation approaches.' },
    { src: '/images/demo/3_image.png', caption: 'Quantum Physics Explorer learning platform with structured course navigation, progress tracking, conceptual overviews, and interactive cards for core quantum mechanics principles like wave-particle duality and entanglement.' },
    { src: '/images/demo/4_image.png', caption: 'Event Poster Designer creative tool interface with comprehensive design toolkit, template library, real-time preview canvas, and detailed property controls for creating professional marketing materials.' },
];

// Create suggestions based on dynamicData examples
const createSuggestionsFromDynamicData = (hourKey: number): Suggestion[] => {
    const hourData = (dynamicData as unknown as Record<string, DynamicData>)[hourKey.toString()];
    if (!hourData || !hourData.examples) return [];

    return hourData.examples.map((example, index) => ({
        id: index + 1,
        title: example.query,
        description: `Compare ${example.interface.toLowerCase()} vs traditional text response. User feedback: "${example.comment}"`,
        activity: hourData.activity,
        oursUrl: example.oursUrl,
        textUrl: example.textUrl,
        interface: example.interface,
        model: example.model,
        chats: [
            {
                role: 'user',
                message: example.query
            },
            {
                role: 'assistant',
                message: `Here's the generative interface created for your ${hourData.activity.toLowerCase()} query. This is an actual interface from our evaluation study.

User feedback: "${example.comment}"`
            },
            {
                role: 'user',
                message: 'How does this compare to traditional chat interfaces?'
            },
            {
                role: 'assistant',
                message: `This ${example.interface.toLowerCase()} interface ${example.interface === 'UI-based' ? 'outperformed traditional chat interfaces' : 'provides alternative value compared to text-based responses'} in our evaluation study.

Key advantages include:
• **Interactive elements** that let you engage with content directly
• **Visual layouts** that organize information more effectively  
• **Task-specific components** designed for your particular use case
• **Reduced cognitive load** through structured presentation

This represents a shift from passive text consumption to active interface interaction.`
            }
        ]
    }));
};

export function DemoPage() {
    const [selectedHour, setSelectedHour] = useState(1);
    const [abstractExpanded, setAbstractExpanded] = useState(false);
    const [shotIdx, setShotIdx] = useState(0);
    const [fullscreenModal, setFullscreenModal] = useState<{
        isOpen: boolean;
        url: string;
        title: string;
    }>({
        isOpen: false,
        url: '',
        title: ''
    });
    const navigate = useNavigate();

    // Get current data based on selected hour
    const rawData = (dynamicData as unknown as Record<string, any>)[selectedHour.toString()] || {
        carousel: [],
        examples: [],
        activity: "",
        gif: ""
    };

    // Create suggestions based on current hour's dynamicData examples
    const suggestionsData: Suggestion[] = createSuggestionsFromDynamicData(selectedHour);

    // Create currentData with required suggestions property for DynamicDataContext
    const currentData = {
        activity: rawData.activity,
        gif: rawData.gif,
        carousel: rawData.carousel,
        examples: rawData.examples,
        textUrls: rawData.textUrls || [],
        suggestions: suggestionsData
    };

    const handleTimeChange = (newHour: number) => {
        setSelectedHour(newHour);
    };

    const handleExploreInterface = (suggestion: Suggestion) => {
        setFullscreenModal({
            isOpen: true,
            url: suggestion.oursUrl,
            title: `${suggestion.title} - Generative UI`
        });
    };

    const handleCloseFullscreen = () => {
        setFullscreenModal({
            isOpen: false,
            url: '',
            title: ''
        });
    };

    const toggleAbstract = () => {
        setAbstractExpanded(!abstractExpanded);
    };

    //     const codeString = `// Example: Interface Specification for Generative UI
    // {
    //   "intent": "explain quantum physics principles",
    //   "components": ["AnimatedDiagram", "InteractiveText", "ConceptQuiz"],
    //   "layout": "educational",
    //   "interactions": {
    //     "hover": "reveal_definitions",
    //     "click": "expand_concepts"
    //   },
    //   "state_machine": {
    //     "states": ["learning", "testing", "reviewing"],
    //     "transitions": {
    //       "learning -> testing": "quiz_start",
    //       "testing -> reviewing": "quiz_complete"
    //     }
    //   }
    // }`;

    return (
        <div className="mx-auto px-[5%] py-5 max-w-7xl">
            <div className="flex justify-between items-start mb-5">
                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-center">
                        Beyond Chat: Generative Interfaces for Language Models
                    </h1>
                </div>
                <div className="ml-4">
                    <ThemeToggle />
                </div>
            </div>

            {/* Authors */}
            <div className="flex flex-wrap justify-center mb-2">
                {[
                    'Jiaqi Chen*',
                    'Yanzhe Zhang*',
                    'Yutong Zhang',
                    'Yijia Shao',
                    'Diyi Yang',
                ].map((name, idx) => (
                    <div key={idx} className="mx-4 mb-2">
                        <div className="text-base font-medium">{name}</div>
                    </div>
                ))}
            </div>

            {/* Affiliation */}
            <div className="text-center mb-2">
                <div className="text-sm text-muted-foreground">Stanford University</div>
            </div>

            {/* Equal Contribution */}
            <div className="text-center mb-4">
                <div className="text-xs text-muted-foreground">* Equal contribution</div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-5">
                <Button className="flex items-center gap-2">
                    <FaFileAlt className="h-4 w-4" />
                    Paper (TODO)
                </Button>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => window.open('https://github.com/genertiveui/genertiveui.github.io', '_blank')}
                >
                    <FaGithub className="h-4 w-4" />
                    GitHub
                </Button>
                {/* <Button className="flex items-center gap-2">
                    <FaBook className="h-4 w-4" />
                    Documentation
                </Button> */}
            </div>

            {/* Abstract Section */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <p className="leading-relaxed text-sm">
                        While large language models (LLMs) can generate diverse content in response to user queries, current interactions between humans and LLMs rely primarily on conversational interfaces that lack intuitive visual representations and interactive elements tailored to specific queries. To address this limitation, we investigate <em><strong>Generative User Interfaces for Language Models</strong></em>, a paradigm where LLMs respond to user queries with dynamic and interactive interfaces rather than traditional text-based responses.
                    </p>

                    {!abstractExpanded && (
                        <div className="flex justify-center mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleAbstract}
                                className="flex items-center gap-2"
                            >
                                <ChevronDown className="h-3 w-3" />
                                Expand abstract
                            </Button>
                        </div>
                    )}

                    {abstractExpanded && (
                        <>
                            <p className="leading-relaxed text-sm mt-4">
                                We implement a prototype featuring a finite-state machine-based intermediate representation, adaptive reward mechanisms, and iterative refinement strategies that enable a process of gradually transforming user queries into specialized UIs designed for each specific query. For systematic evaluation, we establish a multidimensional assessment framework that compares generative UIs against traditional chat interfaces across diverse tasks, interaction patterns, and query types, evaluating functional, interactive, and emotional aspects of user experience. Our findings demonstrate the superior performance of generative UIs as judged by both human evaluators and LLMs, while our analysis reveals when and why users prefer generative interfaces over conversational ones.
                            </p>
                            <div className="flex justify-center mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleAbstract}
                                    className="flex items-center gap-2"
                                >
                                    <ChevronUp className="h-3 w-3" />
                                    Collapse abstract
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* First Demo Section */}
            <div className="layout mb-8">
                <div className="left-pane">
                    <LeftPane
                        selectedHour={selectedHour}
                        onTimeChange={handleTimeChange}
                        activity={currentData.activity}
                        gif={currentData.gif}
                    />
                </div>
                <div className="carousel-pane">
                    <Carousel carouselData={currentData.carousel} />
                    <p style={{ marginTop: '0px' }}>
                        Above shows evaluation results comparing generative UIs against traditional chat interfaces across 10 task categories. Each insight represents a UI/UX finding with its corresponding win rate from our human evaluation study. Drag the slider to explore how interface effectiveness varies across different application domains and interaction contexts.
                    </p>
                </div>
            </div>

            {/* What can you build section */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center">
                        What can you build with Generative UIs?
                    </h3>
                    <p className="leading-relaxed text-sm">
                        Generative User Interfaces transform how users interact with AI by moving beyond simple text responses to create dynamic, interactive experiences tailored to each query. Instead of reading through long paragraphs, users can engage with structured layouts, interactive elements, and visual representations that match their specific needs and cognitive preferences.
                    </p>
                </CardContent>
            </Card>

            {/* Second Demo Section with Interface Examples */}
            <div className="layout mb-8">
                <div className="left-pane">
                    <LeftPane
                        selectedHour={selectedHour}
                        onTimeChange={handleTimeChange}
                        activity={currentData.activity}
                        gif={currentData.gif}
                    />
                </div>
                <div className="carousel-pane">
                    <DynamicDataProvider
                        selectedHour={selectedHour}
                        currentData={currentData}
                    >
                        <App
                            carouselData={currentData.carousel}
                            suggestionsData={suggestionsData}
                            onExploreInterface={handleExploreInterface}
                        />
                    </DynamicDataProvider>
                    <p style={{ marginTop: '0px' }}>
                        Browse interface examples from the current category selected in the left panel. Each example shows a direct comparison between our Generative UI and traditional text chat responses. Click "View Generative UI" to see our interactive interface in fullscreen, or "Compare with Text Chat" to see the traditional chat response. This demonstrates the real evaluation data from our study.
                    </p>
                </div>
            </div>

            {/* Technical Details Section */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold mb-6">Technical Approach</h3>
                    <p className="leading-relaxed text-sm mb-4">
                        Our approach uses a finite state machine-based intermediate representation to systematically model interface state transitions, user interaction flows, and component dependencies. This enables more robust UI generation compared to natural language descriptions.
                    </p>

                    {/* <div className="rounded-lg overflow-hidden mb-6">
                        <SyntaxHighlighter
                            language="javascript"
                            style={oneDark}
                            customStyle={{
                                margin: 0,
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                lineHeight: '1.5',
                                fontFamily: 'var(--font-mono), "IBM Plex Mono", ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                fontWeight: '400'
                            }}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div> */}

                    {/* <h3 className="text-2xl font-semibold mb-4">How it works</h3> */}

                    <div className="bg-card rounded-lg p-5 mb-4">
                        <div className="w-full rounded-lg overflow-hidden">
                            <img
                                src="/images/pipeline-architecture.png"
                                alt="Technical Pipeline Architecture: (a) User Query processed through (b) Interface-specific Language with Finite State Machines to (c) Generated Code and UIs"
                                className="w-full h-auto object-contain"
                                style={{ maxHeight: '400px' }}
                            />
                        </div>
                    </div>

                    <p className="text-center text-xs text-muted-foreground mb-4">
                        <strong>Technical Pipeline:</strong> Three-stage process from user query to functional interface generation.
                    </p>

                    <p className="leading-relaxed text-sm mb-8">
                        Our system consists of three main components: (1) <strong>Intent Recognition</strong> - determines query suitability and transforms inputs into structured interface specifications, (2) <strong>Interface-Specific Language</strong> - uses finite state machines to model UI behavior, state transitions, and component dependencies, and (3) <strong>Iterative Refinement</strong> - employs dynamic reward mechanisms to progressively optimize interface quality and generate robust, functional code.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4">Evaluation Framework</h3>
                    <p className="leading-relaxed text-sm mb-8">
                        We established a comprehensive evaluation framework with 100 diverse prompts across 10 categories, comparing generative UIs against traditional chat interfaces. Our evaluation includes both human studies with 300 participants and LLM-based assessments across seven dimensions: Usability, Task Efficiency, Information Clarity, Actionability, Learnability, Emotional Satisfaction, and Interface Aesthetics.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4">Results</h3>
                    <p className="leading-relaxed text-sm mb-4">
                        Our findings demonstrate that generative UIs significantly outperform traditional chat interfaces across multiple dimensions. Generative UIs show particular strength in tasks requiring visual explanation, structured information presentation, and interactive elements, while maintaining strong performance in cognitive load reduction and user satisfaction.
                    </p>

                    <div className="bg-card rounded-lg p-5 mb-4 max-w-4xl mx-auto">
                        <div className="w-full rounded-lg overflow-hidden">
                            <img
                                src="/images/7_scenarios_human_study.jpg"
                                alt="Scenario-wise Human Evaluation of Conversational vs. Generative UIs showing performance across 10 task scenarios"
                                className="w-full h-auto object-contain"
                                style={{ maxHeight: '500px' }}
                            />
                        </div>
                    </div>

                    <p className="text-center text-xs text-muted-foreground mb-4">
                        <strong>Scenario-wise Human Evaluation:</strong> Across 10 task scenarios, generative UIs consistently outperform conversational UIs in dimensions such as task efficiency, usability, and learnability.
                    </p>

                    <p className="leading-relaxed text-sm mb-8">
                        The evaluation reveals that UI effectiveness depends on alignment with task structure and user cognition. While generative UIs excel in structured domains like Academic Research and Education, traditional chat interfaces remain competitive in tasks involving strategic ambiguity or high-level reasoning.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4">Demo Screenshots</h3>
                    <p className="leading-relaxed text-sm mb-5">
                        Below are examples of generative user interfaces generated by our system for different types of queries and interaction scenarios.
                    </p>

                    {/* Screenshot carousel */}
                    <div className="relative max-w-4xl mx-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShotIdx(i => (i - 1 + screenshots.length) % screenshots.length)}
                            className="absolute left-[-60px] top-1/2 -translate-y-1/2 z-10"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>

                        <div className="w-full h-96 rounded-lg overflow-hidden">
                            <img
                                src={screenshots[shotIdx].src}
                                alt={screenshots[shotIdx].caption}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShotIdx(i => (i + 1) % screenshots.length)}
                            className="absolute right-[-60px] top-1/2 -translate-y-1/2 z-10"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>

                    <p className="text-center mt-3 text-sm text-muted-foreground">
                        {screenshots[shotIdx].caption}
                    </p>

                    <h3 className="text-2xl font-semibold mb-4">Citation</h3>
                    <div className="relative rounded-lg overflow-hidden">
                        <SyntaxHighlighter
                            language="latex"
                            style={oneDark}
                            customStyle={{
                                margin: 0,
                                borderRadius: '0.5rem',
                                fontSize: '0.75rem',
                                lineHeight: '1.4',
                                paddingRight: '4rem',
                                fontFamily: 'var(--font-mono), "IBM Plex Mono", ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                fontWeight: '400'
                            }}
                        >
                            {`@article{chen2025generative,
  title={{Beyond Chat}: Generative Interfaces for Language Models},
  author={Chen, Jiaqi and Zhang, Yanzhe and Zhang, Yutong and Shao, Yijia and Yang, Diyi},
  journal={arXiv preprint},
  year={2025},
  note={Jiaqi Chen and Yanzhe Zhang contributed equally}
}`}
                        </SyntaxHighlighter>
                        <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 text-xs"
                            onClick={() => {
                                const bibtexContent = `@article{chen2025generative,
  title={{Beyond Chat}: Generative Interfaces for Language Models},
  author={Chen, Jiaqi and Zhang, Yanzhe and Zhang, Yutong and Shao, Yijia and Yang, Diyi},
  journal={arXiv preprint},
  year={2025},
  note={Jiaqi Chen and Yanzhe Zhang contributed equally}
}`;
                                navigator.clipboard.writeText(bibtexContent);
                                const btn = event?.target as HTMLButtonElement;
                                btn.textContent = 'Copied!';
                                setTimeout(() => {
                                    btn.textContent = 'Copy';
                                }, 2000);
                            }}
                        >
                            Copy
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Fullscreen Modal */}
            <FullscreenModal
                isOpen={fullscreenModal.isOpen}
                onClose={handleCloseFullscreen}
                url={fullscreenModal.url}
                title={fullscreenModal.title}
            />
        </div>
    );
} 