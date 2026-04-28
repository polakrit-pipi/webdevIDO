import Image from "next/image";
import Button from "./button";

type NewProductCardProps = {
    name: string;
    description: string;
    imageUrl: string;
};

export default function NewProductCard({ name, description, imageUrl }: NewProductCardProps) {
    return (
        <div className="flex flex-col items-center h-full w-full">
            <div className="relative w-full h-[20vw] bg-white rounded-lg overflow-hidden mb-[1.5vw]">
                <Image src={imageUrl} alt={name} fill unoptimized className="object-contain"/>
            </div>
            <h3 className="text-[1.8vw] font-bold mt-[1vw]">{name}</h3>
            <p className="text-[1vw] mb-[1vw]">{description}</p>
            <Button bg="bg-neutral-900" text="text-white" hoverBg="hover:bg-purple-900" hoverText="hover:text-white" text_size="text-[1vw]" label="ดูสินค้า" px="px-[2vw]" py="py-[0.3vw]" link="/prodcut" />
        </div>
    );
}