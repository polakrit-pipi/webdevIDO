import Image from "next/image";

type ProductCardProps = {
    name: string;
    price: number;
    imageUrl: string;
};

export default function ProductCard({ name, price, imageUrl }: ProductCardProps) {
    const src = imageUrl && imageUrl !== '' ? imageUrl : '/placeholder.png';
    return (
        <div className="w-full rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200">
            <div className="relative w-full aspect-[3/4] bg-neutral-200 rounded-t-lg overflow-hidden">
                <Image
                    src={src}
                    alt={name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover rounded-t-lg"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                />
            </div>
            <div className="p-3 text-start flex-1">
                <h3 className="text-sm md:text-base font-semibold truncate">{name}</h3>
                <p className="text-sm text-gray-600">฿{Number(price).toLocaleString()}</p>
            </div>
        </div>
    );
}
