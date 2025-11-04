import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

// Type for FilterSection props
interface FilterSectionProps {
  title: ReactNode;
  children: ReactNode;
}

// Reusable filter section
const FilterSection = ({ title, children }: FilterSectionProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-gray-300 pb-4 mb-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-sm font-semibold text-black">{title}</h3>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
};

// Type for Checkbox
interface CheckboxProps {
  label: string;
  checked?: boolean;
}

const Checkbox = ({ label, checked }: CheckboxProps) => (
  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
    <input
      type="checkbox"
      defaultChecked={checked}
      className="w-4 h-4 accent-indigo-600 border-gray-300 rounded"
    />
    <span>{label}</span>
    <span className="ml-auto text-xs text-gray-400">
      {checked ? "289" : "548"}
    </span>
  </label>
);

// Type for Radio
interface RadioProps {
  label: string;
  name: string;
  checked?: boolean;
}

const Radio = ({ label, name, checked }: RadioProps) => (
  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
    <input
      type="radio"
      name={name}
      defaultChecked={checked}
      className="w-4 h-4 accent-indigo-600 border-gray-300"
    />
    <span>{label}</span>
    <span className="ml-auto text-xs text-gray-400">
      {checked ? "289" : "548"}
    </span>
  </label>
);
interface FilterSidebarProps {
  filters?: {
    article_style: {
      cat_id: string;
      cat_name: string;
      sub_cat: {
        sub_category_id: string;
        name: string;
        image: string;
      }[];
    }[];
    orientations: {
      orientation_id: string;
      name: string;
      img: string;
      total_number: string;
    }[];
    allarticle: {
      [key: string]: {
        article_id: string;
        category_name: string;
        article_type: string;
        article_img: string;
        article_price: string;
        name: string;
        total_number: string;
      }[];
    };
  } | null;
  onApply: (filters: {
    orientation_ids: string[];
    article_style_id: string;
    sub_category_id: string;
    article_type: string;
    price: string;
  }) => void;
}

// Main filter sidebar component
export default function FilterSidebar({
  filters,
  onApply,
}: FilterSidebarProps) {
  const [selectedOrientations, setSelectedOrientations] = useState<string[]>(
    []
  );
  const [selectedArticleStyle, setSelectedArticleStyle] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [selectedArticleType, setSelectedArticleType] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const toggleOrientation = (id: string) => {
    setSelectedOrientations((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApply({
      orientation_ids: selectedOrientations,
      article_style_id: selectedArticleStyle,
      sub_category_id: selectedSub,
      article_type: selectedArticleType,
      price: selectedPrice,
    });
  };
  return (
    <aside className="w-full max-w-xs px-5 py-6">
      {/* Filters Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} />
          <h2 className="font-semibold text-lg">Filters</h2>
        </div>
        <ChevronUp size={18} className="text-gray-600" />
      </div>

      {/* Orientation */}
      <FilterSection
        title={
          <span className="text-indigo-600 font-semibold">Orientation</span>
        }
      >
        {filters?.orientations?.map((o) => (
          <label
            key={o.orientation_id}
            className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
          >
            <input
              type="checkbox"
              checked={selectedOrientations.includes(o.orientation_id)}
              onChange={() => toggleOrientation(o.orientation_id)}
              className="w-4 h-4 accent-indigo-600 border-gray-300 rounded"
            />
            <span>{o.name}</span>
            <span className="ml-auto text-xs text-gray-400">
              ({o.total_number})
            </span>
          </label>
        )) || <div className="text-gray-500 text-sm">No orientations available</div>}
      </FilterSection>

      {/* Article Styles */}
      <FilterSection
        title={
          <span className="text-indigo-600 font-semibold">
            Article Styles
          </span>
        }
      >
        {filters?.article_style?.map((style) => (
          <label
            key={style.cat_id}
            className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
          >
            <input
              type="radio"
              name="article_style"
              checked={selectedArticleStyle === style.cat_id}
              onChange={() => setSelectedArticleStyle(style.cat_id)}
              className="w-4 h-4 accent-indigo-600 border-gray-300"
            />
            <span>{style.cat_name}</span>
          </label>
        )) || <div className="text-gray-500 text-sm">No styles available</div>}
      </FilterSection>

      {/* Subcategories - Show subcategories for selected style */}
      {selectedArticleStyle && (
        <FilterSection
          title={
            <span className="text-indigo-600 font-semibold">Subcategories</span>
          }
        >
          {(() => {
            const selectedStyle = filters?.article_style?.find(s => s.cat_id === selectedArticleStyle);
            return selectedStyle?.sub_cat?.map((sub) => (
              <label
                key={sub.sub_category_id}
                className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name="subcat"
                  checked={selectedSub === sub.sub_category_id}
                  onChange={() => setSelectedSub(sub.sub_category_id)}
                  className="w-4 h-4 accent-indigo-600 border-gray-300"
                />
                <span>{sub.name}</span>
              </label>
            )) || <div className="text-gray-500 text-sm">No subcategories available for this style</div>;
          })()}
        </FilterSection>
      )}

      {/* Article Types */}
      <FilterSection
        title={
          <span className="text-indigo-600 font-semibold">Article Types</span>
        }
      >
        {filters?.allarticle && Object.keys(filters.allarticle).map((articleType) => (
          <label
            key={articleType}
            className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
          >
            <input
              type="radio"
              name="article_type"
              checked={selectedArticleType === articleType}
              onChange={() => setSelectedArticleType(articleType)}
              className="w-4 h-4 accent-indigo-600 border-gray-300"
            />
            <span>{articleType}</span>
            <span className="ml-auto text-xs text-gray-400">
              ({filters.allarticle[articleType].length})
            </span>
          </label>
        )) || <div className="text-gray-500 text-sm">No article types available</div>}
      </FilterSection>

      {/* Price */}
      <FilterSection
        title={<span className="text-indigo-600 font-semibold">Price</span>}
      >
        {[
          { label: "Up To ₹500", value: "0-500" },
          { label: "₹501 - ₹1,999", value: "501-1999" },
          { label: "₹2,000 - ₹4,999", value: "2000-4999" },
          { label: "Above ₹5,000", value: "5000-99999" },
        ].map((p) => (
          <label
            key={p.value}
            className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
          >
            <input
              type="radio"
              name="price"
              checked={selectedPrice === p.value}
              onChange={() => setSelectedPrice(p.value)}
              className="w-4 h-4 accent-indigo-600 border-gray-300"
            />
            <span>{p.label}</span>
          </label>
        ))}
      </FilterSection>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          className="flex-1 bg-gray-100 text-gray-600 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
          onClick={() => {
            setSelectedOrientations([]);
            setSelectedArticleStyle("");
            setSelectedSub("");
            setSelectedArticleType("");
            setSelectedPrice("");
            // Also apply the cleared filters immediately
            onApply({
              orientation_ids: [],
              article_style_id: "",
              sub_category_id: "",
              article_type: "",
              price: "",
            });
          }}
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 rounded text-sm font-medium hover:from-indigo-600 hover:to-blue-600 transition-all"
        >
          Apply
        </button>
      </div>
    </aside>
  );
}
