export default function Heading({ title, color = '#2E5C2B', lineColor = '#16a34a', className = '' }) {
  return (
    <div className={`text-center mb-3 ${className}`}>
      <h2 
        className="text-[28px] font-bold mb-1" 
        style={{ color: color, fontFamily: 'Noto Sans Devanagari, sans-serif' }}
      >
        {title}
      </h2>
      <div 
        className="w-25 h-1 mx-auto rounded-full"
        style={{
          background: `linear-gradient(to right, transparent, ${lineColor}, transparent)`
        }}
      ></div>
    </div>
  );
}
