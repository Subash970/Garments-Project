import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const Index = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [page, setPage] = useState(1);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.clientHeight + 1 >
      document.documentElement.scrollTop
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getBills = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/user/bills?page=${page}&billsPerPage=9`,
        {
          headers: { authorization: localStorage.getItem("token") },
        }
      );
      setBills((prev) => [...prev, ...response.data.bills]);
    } catch (err) {
      setMsg(err.response?.data?.msg || "an error occured. please try again");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    getBills();
  }, [page, getBills]);

  const BillsDom = () => {
    return bills.map((bill, i) => (
      <div
        className="bills d-flex align-items-center border-bottom px-3 my-4"
        key={i}
      >
        <a href={`/bill/${bill._id}`}>
          <div>
            <p className="h5 companyName">{bill.company.CompanyName}</p>
            <p className="py-2">{bill.createdAt.slice(0, 10)}</p>
          </div>
        </a>
        <span className="ms-auto">{bill.company.Address}</span>
      </div>
    ));
  };

  return (
    <>
      <p className="h6 text-danger px-3">{msg}</p>
      <div className="d-flex flex-column mx-4 mt-5">
        {bills.length > 0 ? BillsDom() : <p></p>}
      </div>
      <div className="px-4" style={{ height: "20px" }}>
        {loading && <p>Loading...</p>}
      </div>
    </>
  );
};

export default Index;
