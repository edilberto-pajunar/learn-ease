import BoldEachLetter from "@/components/BoldEachLetter";
import Clock from "@/components/Clock";
import { useReadStore } from "@/hooks/useReadStore";
import { Material } from "@/interface/material";

export default function TimeCard({
    material,
}: {
    material: Material
}) {
    const { setDuration } = useReadStore();

    const handleTime = (time: number) => {
        setDuration(time);
        console.log(time);
    };

    return (
        <div className="flex flex-wrap gap-6">
            <div className="flex flex-col items-center gap-4 mb-6 p-4 border rounded-lg shadow-lg w-full md:w-auto">
                <BoldEachLetter
                    text={material.text}
                    bionic={false}
                    onWordTap={() => { }}
                />
                <Clock
                    onStop={(time) => handleTime(time)}
                />
            </div>
            {/* <div className="flex flex-col items-center gap-4 mb-6 p-4 border rounded-lg shadow-lg w-full md:w-auto">
                <BoldEachLetter
                    text={material.text}
                    bionic={true}
                    onWordTap={() => { }}
                />
                <Clock
                    onStop={(time) => handleTime(time, true)}
                />
            </div> */}
        </div>
    );
}
