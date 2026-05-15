"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  count: number;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  variant?: "text" | "outline-button";
  icon?: React.ReactNode;
  align?: "left" | "right";
}

export default function FilterDropdown({
  label,
  options,
  variant = "text",
  icon,
  align,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const reset = () => setSelected([]);

  // Default alignment: right for buttons, left for text
  const currentAlign =
    align || (variant === "outline-button" ? "right" : "left");

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 transition-all duration-300 h-auto",
          variant === "text" &&
            "text-base font-medium py-2 px-0 rounded-none border-b-2 border-transparent hover:border-black hover:bg-transparent",
          variant === "text" && isOpen && "border-black",
          variant === "outline-button" &&
            "px-4 py-2 border border-[#d9df85] text-black hover:bg-[#d9df85]/10 min-w-[100px] justify-center rounded-none",
          variant === "outline-button" && isOpen && "bg-[#d9df85]/10",
        )}
      >
        {icon && <span>{icon}</span>}
        <span
          className={cn(
            "uppercase tracking-widest",
            variant === "outline-button" && "text-sm font-normal",
          )}
        >
          {label}
        </span>
        {variant === "text" && (
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              isOpen && "rotate-180",
            )}
          />
        )}
      </Button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 w-full h-full border-none bg-transparent cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="Close dropdown"
          />
          <div
            className={cn(
              "absolute top-full mt-4 w-[320px] bg-white border border-gray-100 shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2",
              currentAlign === "right" ? "right-0" : "left-0",
            )}
          >
            <div className="p-5 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {selected.length} selected
              </span>
              <Button
                type="button"
                variant="ghost"
                onClick={reset}
                className="text-sm text-[#9CA878] font-medium hover:underline h-auto p-0 hover:bg-transparent"
              >
                Reset
              </Button>
            </div>
            <div className="h-px bg-gray-100 mx-5" />
            <div className="max-h-[350px] overflow-y-auto p-5 space-y-4">
              {options.map((option) => (
                <label
                  key={option.label}
                  className="flex items-center gap-3 cursor-pointer group/item"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.label)}
                    onChange={() => toggleOption(option.label)}
                    className="w-5 h-5 rounded-none border-gray-300 text-black focus:ring-0 accent-black"
                  />
                  <span className="text-[16px] flex-1 text-black transition-colors">
                    {option.label} ({option.count})
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
