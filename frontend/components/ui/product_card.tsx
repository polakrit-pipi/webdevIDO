import Image from "next/image";

type ProductCardProps = {
    name: string;
    price: number;
    imageUrl: string;
};

export default function ProductCard({ name, price, imageUrl }: ProductCardProps) {
    return (
        <div className="w-[15vw] h-[20vw] rounded-lg shadow-lg cursor-pointer">
            <div className="relative w-full h-[14vw] bg-neutral-200 rounded-t-lg">
                <Image src={imageUrl} alt={name} fill unoptimized sizes="50vw, 25vw" className="object-cover rounded-t-lg" />
            </div>
            <div className="p-[1vw] text-start flex-1">
                <h3 className="text-[1.2vw] font-semibold truncate">{name}</h3>
                <p className="text-[1vw] text-gray-600">฿{price.toLocaleString()}</p>
            </div>
        </div>
    );
}
