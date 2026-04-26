import React from "react";

interface ProductDescriptionProps {
  description: any; // เปลี่ยนเป็น any เพื่อความยืดหยุ่นในการเช็คภายใน
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  // ฟังก์ชันช่วยเหลือในการ Render ข้อมูลแต่ละประเภท
  const renderContent = (value: any) => {
    // กรณีเป็น Array (เช่น material, care_instructions)
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside space-y-1 ml-2">
          {value.map((item, index) => (
            <li key={index} className="text-[1vw] text-[#716F71]">
              {typeof item === "object" ? renderContent(item) : item}
            </li>
          ))}
        </ul>
      );
    }

    // กรณีเป็น Object ซ้อน (เช่น product_info)
    if (typeof value === "object" && value !== null) {
      return (
        <div className="flex flex-col gap-3 ml-2 mt-2">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="flex flex-col gap-1">
              <span className="text-[0.95vw] font-semibold text-black capitalize">
                {subKey.replace(/_/g, " ")}:
              </span>
              <div className="ml-4">{renderContent(subValue)}</div>
            </div>
          ))}
        </div>
      );
    }

    // กรณีเป็นข้อความปกติ
    return <span className="text-[1vw] text-[#716F71]">{value}</span>;
  };

  // ตรวจสอบเบื้องต้นว่า description เป็น object หรือไม่
  let safeDescription: Record<string, unknown> = {};
  if (typeof description === 'string') {
    try {
      safeDescription = JSON.parse(description || '{}');
    } catch {
      // Plain-text description — show it as a single "details" entry
      safeDescription = description ? { details: description } : {};
    }
  } else {
    safeDescription = description || {};
  }

  return (
    <div className="mt-8 flex flex-col gap-8 w-full">
      <h2 className="text-[1.5vw] font-bold pb-4 text-black uppercase tracking-wide">
        ข้อมูลรายละเอียดสินค้า
      </h2>
      
      <div className="flex flex-col gap-8">
        {Object.entries(safeDescription).map(([key, value]) => (
          <section key={key} className="flex flex-col gap-3">
            <h3 className="text-[1.1vw] font-bold text-black uppercase border-l-4 border-[#5F4B8B] pl-3">
              {key.replace(/_/g, " ")}
            </h3>
            
            <div className="pl-4">
              {renderContent(value)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}