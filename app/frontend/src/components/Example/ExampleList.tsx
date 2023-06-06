import { Example } from "./Example";

import styles from "./Example.module.css";

export type ExampleModel = {
    text: string;
    value: string;
};

const EXAMPLES: ExampleModel[] = [
    {
        text: "Is it possible to create a route from any job page?",
        value: "Is it possible to create a route from any job page?"
    },
    { text: "What is the difference between creating a route from dispatch view and list view?", 
     value: "What is the difference between creating a route from dispatch view and list view?" },
    { text: "Can we clone the maintenance?", value: "Can we clone the maintenance?" }
];

interface Props {
    onExampleClicked: (value: string) => void;
}

export const ExampleList = ({ onExampleClicked }: Props) => {
    return (
        <ul className={styles.examplesNavList}>
            {EXAMPLES.map((x, i) => (
                <li key={i}>
                    <Example text={x.text} value={x.value} onClick={onExampleClicked} />
                </li>
            ))}
        </ul>
    );
};
