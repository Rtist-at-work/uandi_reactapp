import React, { useState, useEffect } from "react";
import axios from "axios";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";

const Policy = () => {
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [policyContent, setPolicyContent] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const [policyType, setPolicyType] = useState("Privacy Policy");
  const [faqs, setFaqs] = useState([
    {
      title: "",
      items: [{ question: "", answer: "" }],
    },
  ]);
  const [recall, setRecall] = useState(false);

  const handleTitleChange = (index, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index].title = value;
    setFaqs(updatedFaqs);
  };

  const handleItemChange = (faqIndex, itemIndex, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[faqIndex].items[itemIndex][field] = value;
    setFaqs(updatedFaqs);
  };

  const addQuestion = (faqIndex) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[faqIndex].items.push({ question: "", answer: "" });
    setFaqs(updatedFaqs);
  };

  const removeQuestion = (faqIndex, itemIndex) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[faqIndex].items.splice(itemIndex, 1);
    setFaqs(updatedFaqs);
  };

  const addFaq = () => {
    setFaqs([...faqs, { title: "", items: [{ question: "", answer: "" }] }]);
  };

  const removeFaq = (faqIndex) => {
    setFaqs(faqs.filter((_, index) => index !== faqIndex));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${URI}/upload-faqs`, {
        headers: { "Content-Type": "application/json" },
        faqs,
      });
      if (response.status === 200 || response.status === 201) {
        alert("FAQs added successfully");
        setRecall(!recall);
        setFaqs([{ title: "", items: [{ question: "", answer: "" }] }]);
      }
    } catch (error) {
      console.error("Error uploading FAQs:", error);
    }
  };

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get(
          `${URI}/admin/policy/getpolicy/${policyType}`
        );
        if (response.status === 200) {
          if (policyType === "FAQ") {
            setPolicyContent(
              response.data[0]?.faqs || [
                { type: "paragraph", children: [{ text: "" }] },
              ]
            );
          } else {
            setPolicyContent([
              { type: "paragraph", children: [{ text: response.data || "" }] },
            ]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPolicy();
  }, [policyType, recall]);

  const handleSavePolicy = async () => {
    try {
      const content = policyContent
        .map((block) => block.children.map((text) => text.text).join(""))
        .join("\n");
      const response = await axios.post(`${URI}/admin/policy`, {
        type: policyType,
        content,
      });

      if (response.status === 200 || response.status === 201) {
        alert("Policy saved successfully!");
        setPolicyContent([{ type: "paragraph", children: [{ text: "" }] }]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save policy.");
    }
  };
  return (
    <div className="absolute h-[90%] w-full bg-white-800 rounded-md shadow-md">
      <main className="relative h-[85%] w-full overflow-y-auto overflow-x-hidden scrollbar-hidden">
        <div className="px-4 py-2">
          <h1 className="text-2xl font-bold text-center mb-4">Edit Policies</h1>

          {/* Dropdown to select policy type */}
          <div className="mb-4 flex justify-center">
            <select
              className="p-2 border rounded"
              value={policyType}
              onChange={(e) => {
                setRecall(!recall);
                setPolicyType(e.target.value);
              }}
            >
              <option value="Privacy Policy">Privacy Policy</option>
              <option value="Shipping Policy">Shipping Policy</option>
              <option value="Return Policy">Return Policy</option>
              <option value="Terms & Conditions">Terms & Conditions</option>
              <option value="FAQ">FAQ</option>
            </select>
          </div>
          {policyType !== "FAQ" && typeof policyContent === "object" && (
            <>
              {/* Slate.js Text Editor */}
              <Slate
                editor={editor}
                initialValue={policyContent}
                Value={policyContent[0].children[0].text}
                onChange={setPolicyContent}
              >
                <Editable
                  Value={policyContent[0].children[0].text}
                  placeholder={`Write or edit your ${policyType.replace(
                    "-",
                    " "
                  )} here...`}
                />
              </Slate>

              {/* Undo/Redo buttons */}
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  className="px-6 py-2 bg-gray-500 text-white rounded shadow-lg hover:bg-gray-600"
                  onClick={() => editor.undo()}
                  disabled={!editor.history.undos.length}
                >
                  Undo
                </button>

                <button
                  className="px-6 py-2 bg-gray-500 text-white rounded shadow-lg hover:bg-gray-600"
                  onClick={() => editor.redo()}
                  disabled={!editor.history.redos.length}
                >
                  Redo
                </button>
              </div>

              {/* Save Policy button */}
              <div className="flex justify-center mt-5">
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded shadow-lg hover:bg-blue-700"
                  onClick={handleSavePolicy}
                >
                  Save Policy
                </button>
              </div>
            </>
          )}

          {/* FAQ Editor */}
          {policyType === "FAQ" && (
            <div className="faq-uploader p-5 bg-gray-100">
              <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-bold">Upload FAQs</h1>

                <div className="flex space-x-4">
                  <button
                    className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    onClick={() => {
                      setFaqs(policyContent);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>

              {faqs.map((faq, faqIndex) => (
                <div key={faqIndex} className="mb-6">
                  <input
                    type="text"
                    value={faq.title}
                    onChange={(e) =>
                      handleTitleChange(faqIndex, e.target.value)
                    }
                    className="p-2 w-full mb-4 border rounded"
                    placeholder="FAQ Title"
                  />
                  {faq.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex space-x-4 mb-4">
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) =>
                          handleItemChange(
                            faqIndex,
                            itemIndex,
                            "question",
                            e.target.value
                          )
                        }
                        className="p-2 w-3/4 border rounded"
                        placeholder="Question"
                      />
                      <input
                        type="text"
                        value={item.answer}
                        onChange={(e) =>
                          handleItemChange(
                            faqIndex,
                            itemIndex,
                            "answer",
                            e.target.value
                          )
                        }
                        className="p-2 w-3/4 border rounded"
                        placeholder="Answer"
                      />
                      <button
                        onClick={() => removeQuestion(faqIndex, itemIndex)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => addQuestion(faqIndex)}
                  >
                    Add Question
                  </button>
                  <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => removeFaq(faqIndex)}
                  >
                    Remove FAQ
                  </button>
                </div>
              ))}
              <button
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={addFaq}
              >
                Add FAQ
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Policy;
