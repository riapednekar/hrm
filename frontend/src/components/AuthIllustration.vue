<template>
  <div class="w-full h-full flex items-center justify-center p-4 sm:p-6 select-none">
    <svg 
      class="w-full max-w-[340px] max-h-[55vh] object-contain drop-shadow-sm transition-all duration-300" 
      viewBox="0 0 540 500" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Background floating doodles / icons (opacity 0.65 - 0.9) -->
      
      <!-- Top Left Chat Bubble 'i' -->
      <g stroke="white" stroke-width="1.6" opacity="0.75">
        <path d="M 70 80 H 130 A 8 8 0 0 1 138 88 V 135 A 8 8 0 0 1 130 143 H 90 L 70 158 V 143 H 70 A 8 8 0 0 1 62 135 V 88 A 8 8 0 0 1 70 80 Z" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="100" y1="98" x2="100" y2="101" stroke-linecap="round" stroke-width="2.5" />
        <line x1="100" y1="108" x2="100" y2="128" stroke-linecap="round" stroke-width="2" />
      </g>

      <!-- Globe with 24 -->
      <g stroke="white" stroke-width="1.6" opacity="0.75">
        <circle cx="95" cy="205" r="28" fill="none" />
        <ellipse cx="95" cy="205" rx="14" ry="28" fill="none" />
        <line x1="67" y1="205" x2="123" y2="205" />
        <circle cx="106" cy="216" r="12" fill="#9874ce" stroke="white" stroke-width="1.5" />
        <text x="99" y="221" fill="white" font-size="10" font-weight="bold" font-family="sans-serif">24</text>
      </g>

      <!-- Envelope Mail -->
      <g stroke="white" stroke-width="1.6" opacity="0.75">
        <rect x="75" y="285" width="48" height="32" rx="4" fill="none" />
        <path d="M 75 287 L 99 305 L 123 287" stroke-linejoin="round" />
      </g>

      <!-- Top Right Headset / Support Icon -->
      <g stroke="white" stroke-width="1.6" opacity="0.75">
        <path d="M 370 100 C 370 70 420 70 420 100" fill="none" stroke-linecap="round" />
        <rect x="365" y="96" width="8" height="16" rx="4" fill="none" />
        <rect x="417" y="96" width="8" height="16" rx="4" fill="none" />
        <path d="M 421 112 C 421 125 408 128 398 128" fill="none" stroke-linecap="round" />
      </g>

      <!-- Top Right Dotted Chat Bubble (...) -->
      <g stroke="white" stroke-width="1.6" opacity="0.75">
        <ellipse cx="465" cy="115" rx="22" ry="16" fill="none" />
        <circle cx="455" cy="115" r="1.5" fill="white" />
        <circle cx="465" cy="115" r="1.5" fill="white" />
        <circle cx="475" cy="115" r="1.5" fill="white" />
      </g>

      <!-- Top User Avatar ID Card -->
      <g stroke="white" stroke-width="1.6" opacity="0.75">
        <rect x="235" y="85" width="36" height="46" rx="6" fill="none" />
        <circle cx="253" cy="100" r="7" fill="none" />
        <path d="M 241 120 C 241 112 265 112 265 120" fill="none" />
      </g>

      <!-- Laptop with Phone -->
      <g stroke="white" stroke-width="1.6" opacity="0.75">
        <rect x="335" y="160" width="46" height="30" rx="3" fill="none" />
        <line x1="327" y1="190" x2="389" y2="190" stroke-linecap="round" stroke-width="2" />
        <path d="M 353 168 C 353 168 359 174 365 180" stroke-linecap="round" />
      </g>

      <!-- Question / Sparkle Hand / Idea -->
      <g stroke="white" stroke-width="1.6" opacity="0.75">
        <path d="M 430 220 Q 445 220 455 210 L 465 210 Q 460 225 435 228" fill="none" stroke-linecap="round" />
        <path d="M 445 190 Q 448 180 445 175" stroke-linecap="round" />
        <circle cx="445" cy="195" r="1.5" fill="white" />
      </g>

      <!-- Concentric circle icon right -->
      <g stroke="white" stroke-width="1.6" opacity="0.75">
        <circle cx="435" cy="335" r="12" fill="none" />
        <circle cx="455" cy="335" r="3" fill="none" />
        <circle cx="465" cy="335" r="3" fill="none" />
        <circle cx="475" cy="335" r="3" fill="none" />
      </g>

      <!-- Floating Plus, Crosses, Dots, Sparkles -->
      <g stroke="white" stroke-width="1.4" opacity="0.6" stroke-linecap="round">
        <line x1="160" y1="85" x2="168" y2="93" />
        <line x1="168" y1="85" x2="160" y2="93" />
        <line x1="310" y1="75" x2="318" y2="83" />
        <line x1="318" y1="75" x2="310" y2="83" />
        <line x1="450" y1="70" x2="456" y2="76" />
        <line x1="456" y1="70" x2="450" y2="76" />
        <line x1="150" y1="160" x2="158" y2="168" />
        <line x1="158" y1="160" x2="150" y2="168" />
        <line x1="390" y1="160" x2="398" y2="168" />
        <line x1="398" y1="160" x2="390" y2="168" />
        <line x1="470" y1="260" x2="478" y2="268" />
        <line x1="478" y1="260" x2="470" y2="268" />
        <circle cx="180" cy="120" r="2" fill="white" />
        <circle cx="340" cy="95" r="2" fill="white" />
        <circle cx="210" cy="180" r="2" fill="white" />
        <circle cx="480" cy="180" r="2" fill="white" />
        <circle cx="160" cy="270" r="2.5" fill="white" />
        <circle cx="410" cy="290" r="2" fill="white" />
      </g>

      <!-- Waves at bottom -->
      <path d="M 50 425 Q 65 410 80 425 T 110 425" stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8" />
      <path d="M 425 435 Q 440 420 455 435 T 485 435" stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8" />
      <path d="M 440 375 Q 460 360 480 375 T 520 375" stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8" />

      <!-- Main Computer Screen / Monitor -->
      <!-- Screen Stand Base -->
      <path d="M 235 480 H 350 L 360 495 H 225 Z" fill="#e9e0f7" opacity="0.9" />
      <rect x="275" y="445" width="35" height="40" fill="#ded2f4" />
      
      <!-- Computer Monitor Outer Frame -->
      <rect x="185" y="270" width="220" height="180" rx="16" fill="#181226" />
      <!-- Computer Monitor Inner Display -->
      <rect x="192" y="277" width="206" height="166" rx="10" fill="#201734" />

      <!-- Character (Support Agent / Professional) -->
      <!-- Torso / Purple Outfit -->
      <path d="M 220 443 C 220 365 240 325 295 325 C 350 325 370 365 370 443 Z" fill="#5b3b8c" />
      
      <!-- Neck & Collarbone -->
      <path d="M 280 305 L 280 335 C 285 342 305 342 310 335 L 310 305 Z" fill="#ffffff" />
      
      <!-- Head / Face Silhouette -->
      <!-- Hair Back / Volume -->
      <path d="M 260 270 C 235 240 250 195 285 190 C 330 185 365 220 355 270 C 345 315 315 315 260 270 Z" fill="#181226" />
      <!-- Face -->
      <path d="M 270 235 C 270 215 290 208 305 212 C 315 215 322 225 322 245 C 322 272 305 295 290 295 C 278 295 270 265 270 235 Z" fill="#ffffff" />
      <!-- Hair Front Bangs / Flow -->
      <path d="M 260 245 C 265 210 285 200 300 200 C 290 215 275 235 275 265 Z" fill="#181226" />

      <!-- Headset -->
      <path d="M 292 203 C 310 203 324 216 324 235" stroke="#181226" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <circle cx="323" cy="242" r="5" fill="#181226" />
      <path d="M 322 245 C 322 260 310 268 302 268" stroke="#181226" stroke-width="2" fill="none" stroke-linecap="round" />
      <circle cx="300" cy="268" r="2.5" fill="#5b3b8c" />

      <!-- Arm & Hand with "OK" Gesture -->
      <!-- Left Arm reaching up in white -->
      <path d="M 235 435 C 230 380 220 325 212 305 C 208 295 214 275 220 270 C 224 265 230 270 230 282 C 230 310 240 370 248 435 Z" fill="#ffffff" />
      
      <!-- Hand / Fingers forming "OK" Gesture -->
      <!-- Circle of Thumb & Index Finger -->
      <ellipse cx="230" cy="260" rx="9" ry="11" fill="#ffffff" stroke="#181226" stroke-width="3" />
      <!-- Finger extensions (middle, ring, pinky) -->
      <path d="M 220 255 L 210 220 C 209 214 216 211 219 217 L 225 242" fill="#ffffff" stroke="#181226" stroke-width="2" stroke-linecap="round" />
      <path d="M 226 242 L 222 210 C 221 204 228 202 231 208 L 233 240" fill="#ffffff" stroke="#181226" stroke-width="2" stroke-linecap="round" />
      <path d="M 234 242 L 235 218 C 235 212 242 212 243 218 L 239 250" fill="#ffffff" stroke="#181226" stroke-width="2" stroke-linecap="round" />

      <!-- Circular Checkmark Badge on Left of Monitor -->
      <g filter="drop-shadow(0 4px 10px rgba(0,0,0,0.15))">
        <circle cx="160" cy="315" r="30" fill="#ffffff" />
        <path d="M 148 316 L 157 325 L 174 306" stroke="#5b3b8c" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'AuthIllustration'
};
</script>
