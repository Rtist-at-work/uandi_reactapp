<div className="border-2  border-blue-300 h-48 w-full mt-4 flex-shrink-0 px-4 gap-2 rounded-lg flex items-center overflow-x-auto ">
              {style.length > 0 &&
                style.map((item, index) => {
                  const styles = style.filter((st) => st[0] !== item);
                  return (
                    <div
                      // key={item.key}
                      className={`h-[90%] w-32 text-sm p-1 flex-shrink-0 items-center gap-2 border-2 ${
                        styles.includes(item[0].toLowerCase())
                          ? "border-red-500"
                          : styletemp.includes(item[0].toLowerCase())
                          ? "border-red-500"
                          : "border-blue-300"
                      } rounded`}
                    >
                      <div className="h-[10%] w-full flex justify-end ">
                        <IoIosClose
                          id={index}
                          className=" text-lg cursor-pointer"
                          onClick={() => styledelete(index)}
                        />
                      </div>
                      <p className="top-2 xsm:text-xs md:text-base break-words">{item}</p>
                      <input type="text" className="w-full h-8 mt-4"
                      onchange={(e)=>{
                        setSizes(e.target.value());
                      }}
                      /> 
                      <button>Add</button>
                      
                    </div>
                  );
                })}
            </div>
            <button
              type="submit"
              className="bg-blue-500 h-12 w-full flex-shrink-0 rounded-lg border-2 border-gray-300 mt-4"
            >
              Create Category
            </button>