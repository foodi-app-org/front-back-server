export function Receipt({ sale }) {
  const {
    storeName,
    NitStore,
    addressStore,
    storePhone,
    date,
    products,
    total,
    discount,
    paymentMethod
  } = sale;

  return (
    <div
      style={{
        width: 384,
        fontFamily: "sans-serif",
        padding: "16px",
        fontSize: 12,
        color: "#333"
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "left", marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
          {storeName}
        </div>

        {NitStore && <div>NIT: {NitStore}</div>}
        {addressStore && <div>Dirección: {addressStore}</div>}
        {storePhone && <div>Teléfono: {storePhone}</div>}
      </div>

      {/* Decorative dotted separator */}
      <div
        style={{
          borderBottom: "2px dotted #ccc",
          margin: "14px 0"
        }}
      />

      {/* TITLE */}
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>
        TICKET DE VENTA
      </div>

      {/* DATE */}
      <div style={{ marginBottom: 12 }}>{date}</div>

      {/* TABLE HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 40px 60px 60px",
          fontWeight: "bold",
          padding: "6px 0",
          borderBottom: "1px solid #ddd",
          borderTop: "1px solid #ddd",
          background: "#f7f7f7"
        }}
      >
        <div>Descripción</div>
        <div style={{ textAlign: "center" }}>Cant</div>
        <div style={{ textAlign: "right" }}>Precio</div>
        <div style={{ textAlign: "right" }}>Total</div>
      </div>

      {/* PRODUCTS */}
      {products.map((p) => {
        const rowTotal = p.ProQuantity * p.unitPrice;

        return (
          <div
            key={p.pId}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid #eee"
            }}
          >
            {/* Main product */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 40px 60px 60px",
                marginBottom: p.dataExtra.length ? 4 : 0
              }}
            >
              <div>{p.pName}</div>
              <div style={{ textAlign: "center" }}>{p.ProQuantity}</div>
              <div style={{ textAlign: "right" }}>
                {formatMoney(p.unitPrice)}
              </div>
              <div style={{ textAlign: "right" }}>
                {formatMoney(rowTotal)}
              </div>
            </div>

            {/* Extras */}
            {p.dataExtra?.map((ex) => {
              const totalExtra = ex.extraPrice * ex.quantity;

              return (
                <div
                  key={ex.exPid}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 40px 60px 60px",
                    paddingLeft: 10,
                    marginBottom: 3,
                    fontSize: 11,
                    color: "#666"
                  }}
                >
                  <div>• {ex.extraName}</div>
                  <div style={{ textAlign: "center" }}>{ex.quantity}</div>
                  <div style={{ textAlign: "right" }}>
                    {formatMoney(ex.extraPrice)}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {formatMoney(totalExtra)}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* SUMMARY */}
      <div style={{ marginTop: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: 14
          }}
        >
          <span>TOTAL</span>
          <span>{formatMoney(total)}</span>
        </div>

        {discount?.price > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4
            }}
          >
            <span>Descuento</span>
            <span>-{formatMoney(discount.price)}</span>
          </div>
        )}

        <div
          style={{
            marginTop: 6,
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <span>Método de pago:</span>
          <span>{paymentMethod}</span>
        </div>
      </div>

      {/* THANK YOU */}
      <div style={{ textAlign: "center", marginTop: 18 }}>
        Gracias por su compra
      </div>

      {/* Decorative bottom cut */}
      <div
        style={{
          marginTop: 16,
          borderBottom: "8px zigzag #ccc", // esto no existe, pero igual rejugamos visualmente el borde
          textAlign: "center",
          fontSize: 10,
          color: "#ccc"
        }}
      >
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      </div>
    </div>
  );
}

function formatMoney(num) {
  return Number(num).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  });
}
