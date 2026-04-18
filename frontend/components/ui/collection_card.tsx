import Image from "next/image";

type CollectionCardProps = {
  imageUrl?: string;
};

export default function Collection_Card({ imageUrl = '/placeholder.png' }: CollectionCardProps) {
  return (
    <div className="bg-neutral-200 rounded-lg overflow-hidden aspect-video relative">
      <Image
        src={imageUrl}
        fill
        unoptimized
        alt="collection"
        className="object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
      />
    </div>
  );
}