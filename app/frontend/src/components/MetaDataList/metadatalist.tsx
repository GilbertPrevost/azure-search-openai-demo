import { Stylesheet } from "@fluentui/react";
import React, { useEffect, useState } from "react";
// import LoadSpinner from '@/components/ui/LoadingSpinner';
import styles from "./metadatalist.module.css";


interface MetadataItem {
    label: string;
    value: string | { valueList: MetadataItem[] };
}

interface JSONData {
    [key: string]: {
        metadata: MetadataItem[];
    };
}

const renderValueList = (valueList: MetadataItem[]) => (
    <ul className="list-disc list-inside ml-5">
        {valueList.map((item, index) => (
            <li key={index}>
                {item.label}: {item.value as React.ReactNode}
            </li>
        ))}
    </ul>
);

interface MetadataListProps {
    rootObjectName: keyof JSONData | "";
}

const MetadataList: React.FC<MetadataListProps> = ({ rootObjectName }) => {
    const [jsonData, setJsonData] = useState<JSONData | null>(null);
    const [metadata, setMetadata] = useState<MetadataItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Add this line

    useEffect(() => {
        if (!rootObjectName) return;

        console.log("Fetching data for rootObjectName:", rootObjectName);

        const fetchData = async () => {
            setIsLoading(true); // Set loading state to true when starting fetch
            try {
                // const response = await fetch("http://54.172.137.151:81/api/FileUpload/GetFile", {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify({ uuid: rootObjectName })
                // });

                // if (!response.ok) {
                //     console.error("Failed to fetch data");
                //     return;
                // }

                // const data = await response.json();

                   

                // if (data && data.metaData) {
                //     const parsedMetaData = JSON.parse(data.metaData);
                //     const parsedMetaDataKey = Object.keys(parsedMetaData)[0];
                //     const metadata = parsedMetaData[parsedMetaDataKey]?.metadata;

                //     if (metadata) {
                //         setJsonData({
                //             [rootObjectName]: {
                //                 metadata: metadata
                //             }
                //         });
                //         setMetadata(metadata);
                //     }
                // } else {
                //     console.error("Invalid data returned from API");
                // }

              
                    const parsedMetaData = JSON.parse("{\"20230524_225901_24. Jobs In OneView.pdf\": {\"metadata\": [{\"label\": \"TotalWordsvalue\", \"value\": \"3332\"}, {\"label\": \"UniqueWordsvalue\", \"value\": \"688\"}, {\"label\": \"Nouns\", \"value\": \"1176\"}, {\"label\": \"Verbs\", \"value\": \"493\"}, {\"label\": \"Pronouns\", \"value\": \"119\"}, {\"label\": \"MostCommonWords\", \"value\": {\"valueList\": [{\"label\": \"the\", \"value\": \"253\"}, {\"label\": \"to\", \"value\": \"126\"}, {\"label\": \"job\", \"value\": \"88\"}, {\"label\": \"a\", \"value\": \"77\"}, {\"label\": \"in\", \"value\": \"70\"}, {\"label\": \"and\", \"value\": \"66\"}, {\"label\": \"of\", \"value\": \"61\"}, {\"label\": \"you\", \"value\": \"61\"}, {\"label\": \"Jobs\", \"value\": \"50\"}, {\"label\": \"will\", \"value\": \"49\"}]}}, {\"label\": \"AvgSentenceLength\", \"value\": \"19.8\"}, {\"label\": \"AvgWordLength\", \"value\": \"4.14\"}, {\"label\": \"StopWordsCount\", \"value\": \"1506\"}, {\"label\": \"StopWordsRatio\", \"value\": \"45.2%\"}]}}");
                    const parsedMetaDataKey = Object.keys(parsedMetaData)[0];
                    const metadata = parsedMetaData[parsedMetaDataKey]?.metadata;

                    if (metadata) {
                        setJsonData({
                            [rootObjectName]: {
                                metadata: metadata
                            }
                        });
                        setMetadata(metadata);
                    }
               
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false); // Set loading state to false when finished
            }
        };

        fetchData();
    }, [rootObjectName]);

    // if (isLoading) {
    //     return null;
    //     // return <LoadSpinner />;  // Show a loading message or a spinner
    // }

    if (!rootObjectName || !jsonData || !jsonData[rootObjectName]) {
        return <div>Please select a valid root object.</div>;
    }

    return (

        //  <div>Values are getting</div>
        <div className={styles.metadate1}>
            <ul className={styles.mylist}>
                {metadata.map((item, index) => (
                    <li key={index}>
                        <span className={styles.fontbold}>{item.label}: </span>
                        {typeof item.value === "string" ? item.value : /* renderValueList(item.value.valueList) */ ""}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MetadataList;
