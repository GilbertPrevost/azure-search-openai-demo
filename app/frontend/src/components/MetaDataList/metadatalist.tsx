import React, { useEffect, useState } from "react";
// import LoadSpinner from '@/components/ui/LoadingSpinner';

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
                const response = await fetch("http://54.172.137.151:81/api/FileUpload/GetFile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ uuid: rootObjectName })
                });

                if (!response.ok) {
                    console.error("Failed to fetch data");
                    return;
                }

                const data = await response.json();

                if (data && data.metaData) {
                    const parsedMetaData = JSON.parse(data.metaData);
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
                } else {
                    console.error("Invalid data returned from API");
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

         <div>Values are getting</div>
        // <div className="pl-4 pb-4 bg-white shadow-md rounded-md text-sm">
        //     <ul className="list-disc list-inside">
        //         {metadata.map((item, index) => (
        //             <li key={index}>
        //                 <span className="font-bold">{item.label}: </span>
        //                 {typeof item.value === "string" ? item.value : /* renderValueList(item.value.valueList) */ ""}
        //             </li>
        //         ))}
        //     </ul>
        // </div>
    );
};

export default MetadataList;
