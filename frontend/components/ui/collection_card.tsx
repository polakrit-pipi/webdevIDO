import Image from "next/image";

export default function Collection_Card() {
    return (
        <div className="bg-neutral-200 rounded-lg h-fit flex items-center justify-center">
            <Image src='/collection-card-placeholder.png' width={640} height={360} alt="collection-card" className="object-contain" />
        </div>
    );
}