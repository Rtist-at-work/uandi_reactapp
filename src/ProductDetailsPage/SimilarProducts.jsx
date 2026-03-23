// import React from "react";

// const SimilarProducts = ({ products }) => {
//   const url = import.meta.env.VITE_API_URL;
//   return (
//     <div className="mt-14 px-6">
//       <h2 className="text-2xl font-semibold mb-5">Similar Products</h2>

//       <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
//         {products.map((prod) => (
//           <div
//             key={prod._id}
//             className="min-w-[200px] max-w-[200px] bg-white border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
//           >
//             {/* Image */}
//             <div className="w-full h-48 rounded-t-xl overflow-hidden">
//               <img
//                 src={`${url}/api/mediaDownload/${prod.productImages[0]}`}
//                 alt={prod.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             {/* Content */}
//             <div className="p-3 flex flex-col gap-1">
//               <p className="font-semibold text-gray-800 line-clamp-1">
//                 {prod.name}
//               </p>

//               {/* Rating */}
//               <div className="flex items-center gap-1 text-sm text-yellow-500">
//                 <span>★</span>
//                 <span className="text-gray-700">{prod.rating}</span>
//               </div>

//               {/* Price */}
//               <div className="flex items-center gap-2">
//                 <p className="text-lg font-bold text-green-700">
//                   ₹{prod.price}
//                 </p>
//                 {prod.oldPrice && (
//                   <p className="text-gray-500 line-through text-sm">
//                     ₹{prod.oldPrice}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SimilarProducts;
