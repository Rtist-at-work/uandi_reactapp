// import { useState, useEffect } from "react";
// import { FaTimes, FaTrash, FaPlus, FaEdit } from "react-icons/fa";
// import FormInput from "../FormInput";
// import toast from "react-hot-toast";

// const Modal = ({
//   openForm,
//   setOpenForm,
//   selectedProduct,
//   updateProduct,
//   createProduct,
//   handleSaveProduct,
// }) => {
//   const initialState = {
//     title: "",
//     description: "",
//     brand: "",
//     category: "",
//     price: "",
//     discountPrice: "",
//     stock: "",
//     images: [], // { url, name, file }
//     specifications: {},
//     variants: [],
//     isFeatured: false,
//     isActive: true,
//   };

//   const [loading, setLoading] = useState(false);

//   const [product, setProduct] = useState(initialState);

//   const [specKey, setSpecKey] = useState("");
//   const [specValue, setSpecValue] = useState("");
//   const [editingSpec, setEditingSpec] = useState(null);

//   const [variant, setVariant] = useState({
//     name: "",
//     additionalPrice: "",
//     stock: "",
//   });
//   const [editingVariantIndex, setEditingVariantIndex] = useState(null);

//   //initial state updation
//   useEffect(() => {
//     if (selectedProduct) {
//       setProduct({
//         ...selectedProduct,
//         images: (selectedProduct.images || []).map((img, index) => ({
//           uri: img.uri || img,
//           altText: img.name || `image-${index}`,
//           _id: img._id || null,
//         })),

//         specifications: selectedProduct.specifications || {},
//         variants: selectedProduct.variants || [],
//       });
//     } else {
//       setProduct(initialState);
//     }
//   }, [selectedProduct]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setProduct({
//       ...product,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleWheel = (e) => e.target.blur();

//   // image updation
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);

//     const newImages = files.map((file) => ({
//       file,
//       uri: URL.createObjectURL(file),
//       altText: file.name,
//     }));

//     setProduct((prev) => ({
//       ...prev,
//       images: [...prev.images, ...newImages],
//     }));
//   };

//   //  image deletion
//   const removeImage = (index) => {
//     const updated = product.images.filter((_, i) => i !== index);
//     setProduct({ ...product, images: updated });
//   };

//   // specification
//   const addSpecification = () => {
//     if (!specKey || !specValue) return;

//     setProduct((prev) => ({
//       ...prev,
//       specifications: {
//         ...prev.specifications,
//         [specKey]: specValue,
//       },
//     }));

//     setSpecKey("");
//     setSpecValue("");
//     setEditingSpec(null);
//   };

//   const deleteSpecification = (key) => {
//     const updated = { ...product.specifications };
//     delete updated[key];
//     setProduct({ ...product, specifications: updated });
//   };

//   const editSpecification = (key, value) => {
//     setSpecKey(key);
//     setSpecValue(value);
//     setEditingSpec(key);
//   };

//   // variants
//   const addVariant = () => {
//     if (!variant.name) return;

//     const formattedVariant = {
//       ...variant,
//       additionalPrice: Number(variant.additionalPrice) || 0,
//       stock: Number(variant.stock) || 0,
//     };

//     if (editingVariantIndex !== null) {
//       const updated = [...product.variants];
//       updated[editingVariantIndex] = formattedVariant;
//       setProduct({ ...product, variants: updated });
//       setEditingVariantIndex(null);
//     } else {
//       setProduct({
//         ...product,
//         variants: [...product.variants, formattedVariant],
//       });
//     }

//     setVariant({ name: "", additionalPrice: "", stock: "" });
//   };

//   const deleteVariant = (index) => {
//     const updated = product.variants.filter((_, i) => i !== index);
//     setProduct({ ...product, variants: updated });
//   };

//   const editVariant = (index) => {
//     setVariant({
//       ...product.variants[index],
//       additionalPrice: product.variants[index].additionalPrice.toString(),
//       stock: product.variants[index].stock.toString(),
//     });
//     setEditingVariantIndex(index);
//   };

//   //   validation
//   const validateForm = () => {
//     if (!product.title.trim()) return "Title is required";
//     if (!product.description.trim()) return "Description is required";
//     if (!product.brand.trim()) return "Brand is required";
//     if (!product.category.trim()) return "Category is required";

//     if (!product.price || Number(product.price) <= 0)
//       return "Valid price is required";

//     if (
//       product.discountPrice &&
//       Number(product.discountPrice) > Number(product.price)
//     )
//       return "Discount price cannot be greater than price";

//     if (!product.stock || Number(product.stock) < 0)
//       return "Valid stock is required";

//     return null;
//   };

//   //   form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const error = validateForm();
//     if (error)
//       return toast.error(
//         error?.response?.data?.message ||
//           error.message ||
//           "Something went wrong",
//       );

//     const fd = new FormData();

//     Object.keys(product).forEach((key) => {
//       if (key !== "images") {
//         fd.append(key, JSON.stringify(product[key]));
//       }
//     });

//     product.images.forEach((img) => {
//       if (img.file) {
//         fd.append("images", img.file);
//       }
//     });

//     if (selectedProduct) {
//       const existing = product.images.filter((img) => !img.file);
//       const currentIds = existing.map((img) => img._id);

//       const deletedFiles = selectedProduct.images
//         .filter((img) => !currentIds.includes(img._id))
//         .map((img) => img._id);

//       fd.append("existingImages", JSON.stringify(existing));
//       fd.append("deletedImages", JSON.stringify(deletedFiles));
//     }

//     try {
//       setLoading(true);

//       let res;

//       if (selectedProduct) {
//         res = await updateProduct(selectedProduct._id, fd);
//         handleSaveProduct(res.data, true); //update response data
//       } else {
//         res = await createProduct(fd);
//         handleSaveProduct(res.data, false); //update response data
//       }

//       setProduct(initialState);
//       setSpecKey("");
//       setSpecValue("");
//       setVariant({
//         name: "",
//         additionalPrice: "",
//         stock: "",
//       });
//       setOpenForm(false);
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
    <div
      className={`fixed top-0 right-0 h-screen w-full sm:w-[90%] md:w-[600px] lg:w-[700px]
      bg-white shadow-2xl transform transition-transform duration-500 z-50
      ${openForm ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">
          {selectedProduct ? "Edit Product" : "Upload Product"}
        </h2>
        <button
          onClick={() => {
            setProduct(initialState);
            setOpenForm(false);
          }}
        >
          <FaTimes />
        </button>
      </div>

      {/* form */}
      <form
        onSubmit={handleSubmit}
        className="px-6 py-5 space-y-8 overflow-y-auto h-[calc(100%-70px)]"
      >
        <section className="space-y-5">
          <h3 className="text-lg font-semibold border-b pb-2">
            Basic Information
          </h3>

          <FormInput
            label="Title"
            name="title"
            value={product.title}
            onChange={handleChange}
          />
          <FormInput
            label="Description"
            name="description"
            textarea
            value={product.description}
            onChange={handleChange}
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <FormInput
              label="Brand"
              name="brand"
              value={product.brand}
              onChange={handleChange}
            />
            <FormInput
              label="Category"
              name="category"
              value={product.category}
              onChange={handleChange}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <FormInput
              label="Price"
              name="price"
              type="number"
              value={product.price}
              onWheel={handleWheel}
              onChange={handleChange}
            />
            <FormInput
              label="Discount Price"
              name="discountPrice"
              type="number"
              value={product.discountPrice}
              onWheel={handleWheel}
              onChange={handleChange}
            />
            {/* ✅ NEW DROPDOWN */}
            <div className="flex flex-col">
              <label className="text-sm mb-1">Discount Type</label>
              <select
                name="discountType"
                value={product.discountType}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              >
                <option value="flat">Flat (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <FormInput
              label="Stock"
              name="stock"
              type="number"
              value={product.stock}
              onWheel={handleWheel}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* images */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Images</h3>

          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full border p-2 rounded-lg"
            onChange={handleFileChange}
          />

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {product.images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.uri}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-red-500 hover:text-white"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* specifications */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Specifications
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormInput
              placeholder="Key"
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
            />
            <FormInput
              placeholder="Value"
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={addSpecification}
            className="flex items-center gap-2 text-sm border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <FaPlus /> {editingSpec ? "Update" : "Add"} Specification
          </button>

          <div className="space-y-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center border p-2 rounded-lg"
              >
                <span>
                  {key} : {value}
                </span>
                <div className="flex gap-3">
                  <FaEdit onClick={() => editSpecification(key, value)} />
                  <FaTrash onClick={() => deleteSpecification(key)} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* variants */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Variants</h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <FormInput
              label="Variant Name"
              value={variant.name}
              onChange={(e) => setVariant({ ...variant, name: e.target.value })}
            />
            <FormInput
              label="Extra Price"
              type="number"
              value={variant.additionalPrice}
              onWheel={handleWheel}
              onChange={(e) =>
                setVariant({
                  ...variant,
                  additionalPrice: e.target.value,
                })
              }
            />
            <FormInput
              label="Stock"
              type="number"
              value={variant.stock}
              onWheel={handleWheel}
              onChange={(e) =>
                setVariant({ ...variant, stock: e.target.value })
              }
            />
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-2 text-sm border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <FaPlus /> {editingVariantIndex !== null ? "Update" : "Add"} Variant
          </button>

          <div className="space-y-2">
            {product.variants.map((v, index) => (
              <div
                key={index}
                className="flex justify-between items-center border p-2 rounded-lg"
              >
                <span>
                  {v.name} | ₹{v.additionalPrice} | Stock: {v.stock}
                </span>
                <div className="flex gap-3">
                  <FaEdit onClick={() => editVariant(index)} />
                  <FaTrash onClick={() => deleteVariant(index)} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* flags */}
        <div className="flex gap-8">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isFeatured"
              checked={product.isFeatured}
              onChange={handleChange}
            />
            Featured
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isActive"
              checked={product.isActive}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        <button
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 text-white"}`}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </>
          ) : selectedProduct ? (
            "Update Product"
          ) : (
            "Submit Product"
          )}
        </button>
      </form>
    </div>
//   );
// };

// export default Modal;


      {/* HEADER */}
      <div className="flex justify-between p-4 border-b bg-gray-50">
        <h2>{selectedProduct ? "Edit Product" : "Upload Product"}</h2>
        <FaTimes onClick={() => setOpenForm(false)} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-5 space-y-6 overflow-y-auto h-full"
      >
        {/* BASIC */}
        <section>
          <h3 className="border-b mb-3">Basic Info</h3>
          {renderInputs(basicFields, product, handleChange)}

          <div className="grid grid-cols-2 gap-4">
            {renderInputs(gridFields, product, handleChange)}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {renderInputs(priceFields, product, handleChange, handleWheel)}

            {/* dropdown stays custom */}
            <select
              name="discountType"
              value={product.discountType}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="flat">Flat</option>
              <option value="percentage">%</option>
            </select>
          </div>
        </section>

        {/* IMAGES */}
        <section>
          <h3 className="border-b mb-3">Images</h3>

          <input type="file" multiple onChange={handleFileChange} />

          <div className="grid grid-cols-4 gap-3 mt-3">
            {product.images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img.uri} className="h-20 w-full object-cover" />
                <FaTrash
                  className="absolute top-1 right-1 cursor-pointer"
                  onClick={() => removeImage(i)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* SUBMIT */}
        <FormButton loading={loading}>
          {selectedProduct ? "Update Product" : "Submit Product"}
        </FormButton>
      </form>
    </div>