import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function RedirectPage() {
  const { store, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (store && id) {
      navigate(`/${store}?product=${id}`);
    }
  }, [store, id, navigate]);

  return <div>Redirigindo...</div>;
}