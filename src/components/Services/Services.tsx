import './Services.scss'

export const Services = () => {
  return (
    <section id="services" className="services">
      <div className="services-container">
        <div className="services-title">
          <h2>MIS SERVICIOS</h2>
        </div>
        <div className="services-content">
          <div className="services-grid">
            <div className="service-card">
              <h3>DESARROLLO PERSONALIZADO</h3>
              <p>
                Creo aplicaciones y sistemas informáticos desde cero, 
                adaptados completamente a las necesidades específicas 
                de tu negocio o proyecto.
              </p>
              <ul>
                <li>Aplicaciones web y móviles</li>
                <li>Sistemas operativos personalizados</li>
                <li>APIs y microservicios</li>
                <li>Bases de datos optimizadas</li>
              </ul>
            </div>
            
            <div className="service-card">
              <h3>DISEÑO DE SOFTWARE</h3>
              <p>
                Análisis y diseño de arquitecturas robustas y escalables, 
                planificando cada detalle antes de la implementación 
                para garantizar el éxito del proyecto.
              </p>
              <ul>
                <li>Arquitectura de sistemas</li>
                <li>Diseño de interfaces</li>
                <li>Modelado de bases de datos</li>
                <li>Documentación técnica</li>
              </ul>
            </div>
            
            <div className="service-card">
              <h3>MANTENIMIENTO</h3>
              <p>
                Modifico y configuro aplicaciones existentes para 
                que funcionen perfectamente con tus sistemas actuales, 
                incluyendo actualizaciones y soporte continuo.
              </p>
              <ul>
                <li>Configuración de sistemas</li>
                <li>Actualizaciones y parches</li>
                <li>Optimización de rendimiento</li>
                <li>Migración de datos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}