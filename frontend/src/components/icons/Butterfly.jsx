/**
 * A simplified line-art butterfly echoing the logo's butterfly motif.
 * Used as a recurring signature element across the site: section
 * dividers, empty states, loading animation, wishlist icon.
 */
export default function Butterfly({ size = 24, className = '', animate = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={`${className} ${animate ? 'butterfly-flutter' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M24 14C24 14 21 4 13 5C5 6 6 16 12 19C17.5 21.7 22 18.5 24 14Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M24 14C24 14 27 4 35 5C43 6 42 16 36 19C30.5 21.7 26 18.5 24 14Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M24 16C24 16 20.5 24 14 25C7.5 26 7 34 13.5 36C20 38 24 30 24 24"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <path
        d="M24 16C24 16 27.5 24 34 25C40.5 26 41 34 34.5 36C28 38 24 30 24 24"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <line x1="24" y1="11" x2="24" y2="37" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M24 11C23 9 21.5 8 20 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M24 11C25 9 26.5 8 28 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
